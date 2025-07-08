const db = require('../db');


// Get all dishes
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

  // Valid sort columns
  const sortable = ['name', 'prep_time', 'cook_time'];
  const sortBy = sortable.includes(sort) ? sort : 'name';
  const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

  const whereClause = filters.length ? 'WHERE ' + filters.join(' AND ') : '';
  const query = `SELECT * FROM dishes ${whereClause} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
  const countQuery = `SELECT COUNT(*) as total FROM dishes ${whereClause}`;

  try {
    const [[{ total }]] = await db.query(countQuery, values);
    const [rows] = await db.query(query, [...values, limit, offset]);

    res.json({
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Get dish by ID
exports.getDishById = async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await db.query('SELECT * FROM dishes WHERE id = ?', [id]);
        // res.json(rows[0] || {});
        res.json({
            data: rows
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
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
            const dishIngredients = dish.ingredients.toLowerCase().split(',').map(i => i.trim());
            return dishIngredients.every(i => inputIngredients.map(j => j.toLowerCase()).includes(i));
        });

        res.json(matched);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllIngredients = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT ingredients FROM dishes');

    const allIngredients = rows
      .flatMap(row => row.ingredients.split(',').map(i => i.trim().toLowerCase()))
      .filter(i => i); // remove empty

    const uniqueIngredients = [...new Set(allIngredients)].sort();

    res.json(uniqueIngredients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

