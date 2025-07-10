const db = require('../db');
const { StatusCodes } = require('http-status-codes');

// Get all dishes with optional filters and pagination
exports.getAllDishes = async (req, res) => {
  const { diet, flavor, state, sort = 'name', order = 'asc' } = req.query;
  const filters = [];
  const values = [];

  if (diet) {
    filters.push('diet = ?');
    values.push(diet);
  }
  if (flavor) {
    filters.push('flavor_profile = ?');
    values.push(flavor);
  }
  if (state) {
    filters.push('state = ?');
    values.push(state);
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Allow only specific columns for sorting
  const sortable = ['name', 'prep_time', 'cook_time'];
  const sortBy = sortable.includes(sort) ? sort : 'name';
  const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const query = `SELECT * FROM dishes ${whereClause} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
  const countQuery = `SELECT COUNT(*) as total FROM dishes ${whereClause}`;

  try {
    const [[{ total }]] = await db.query(countQuery, values);
    const [rows] = await db.query(query, [...values, limit, offset]);

    res.status(StatusCodes.OK).json({
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Get dish by ID
exports.getDishById = async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await db.query('SELECT * FROM dishes WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Dish not found' });
    }

    res.status(StatusCodes.OK).json({ data: rows[0] });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Suggest dishes based on ingredients
exports.suggestDishes = async (req, res) => {
  const inputIngredients = req.body.ingredients.map(i => i.toLowerCase());

  try {
    const conditions = inputIngredients.map(() => `ingredients LIKE ?`).join(' OR ');
    const values = inputIngredients.map(i => `%${i}%`);
    const query = `SELECT * FROM dishes WHERE ${conditions}`;

    const [rows] = await db.query(query, values);

    const matched = rows.filter(dish => {
      const dishIngredients = dish.ingredients
        .toLowerCase()
        .split(',')
        .map(i => i.trim());

      return dishIngredients.every(i =>
        inputIngredients.includes(i)
      );
    });

    if (matched.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'No matching dishes found' });
    }

    res.status(StatusCodes.OK).json(matched);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Get all unique ingredients
exports.getAllIngredients = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT ingredients FROM dishes');

    const allIngredients = rows
      .flatMap(row =>
        row.ingredients
          .split(',')
          .map(i => i.trim().toLowerCase())
      )
      .filter(Boolean); // remove empty strings

    const uniqueIngredients = [...new Set(allIngredients)].sort();

    res.status(StatusCodes.OK).json(uniqueIngredients);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Search dishes by name, ingredients, state, or region
exports.searchDishes = async (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  if (!query) return res.status(StatusCodes.OK).json([]);

  try {
    const sql = `
      SELECT id, name
      FROM dishes
      WHERE LOWER(name) LIKE ?
         OR LOWER(ingredients) LIKE ?
         OR LOWER(state) LIKE ?
         OR LOWER(region) LIKE ?
      LIMIT 10
    `;

    const likeQuery = `%${query}%`;
    const [rows] = await db.execute(sql, [likeQuery, likeQuery, likeQuery, likeQuery]);

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'No dishes matched your search' });
    }


    res.status(StatusCodes.OK).json(rows);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
};
