const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    // If user not found
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid email or password' });
    }

    // If user doesn't exist or password doesn't match
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response with token
    res.status(StatusCodes.OK).json({
      token,
      user: { email: user.email }
    });
  } catch (err) {
    // Internal server error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Register Controller
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

    // Respond with success
    res.status(StatusCodes.CREATED).json({ message: 'User registered successfully' });
  } catch (err) {
    // Internal server error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};
