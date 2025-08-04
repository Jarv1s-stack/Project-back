const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !username || username.length < 3 ||
      !emailPattern.test(email) ||
      !password || password.length < 6
    ) {
      return res.status(400).json({ message: 'Введите корректные имя, email и пароль (минимум 6 символов)' });
    }

    const userExist = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExist.rows.length) {
      return res.status(409).json({ message: 'Email уже используется' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : null;

    const result = await pool.query(
      'INSERT INTO users(username, email, password, avatar) VALUES($1, $2, $3, $4) RETURNING id, username, email, points, avatar',
      [username, email, hashed, avatarPath]
    );
    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, points: user.points, avatar: user.avatar },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ user, token });
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }
    const result = await pool.query(
      'SELECT id, username, email, password, points, avatar FROM users WHERE email = $1',
      [email]
    );
    if (!result.rows.length) {
      return res.status(401).json({ message: 'Неверные данные для входа' });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Неверные данные для входа' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, points: user.points, avatar: user.avatar },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      user: { id: user.id, username: user.username, email: user.email, points: user.points, avatar: user.avatar },
      token
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
