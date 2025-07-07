const db = require('../db');


// Get all dishes
exports.getAllDishes = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM dishes');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get dish by ID
exports.getDishById = async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await db.query('SELECT * FROM dishes WHERE id = ?', [id]);
        res.json(rows[0] || {});
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
