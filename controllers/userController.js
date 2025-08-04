const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT id, username, email, points, avatar, created_at FROM users WHERE id = $1',
      [userId]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.getOtherProfile = async (req, res) => {
  try {
    const userId = req.params.id
    const result = await pool.query(
      'SELECT id, username, email, points, avatar, created_at FROM users WHERE id = $1',
      [userId]
    );


    if (!result.rows.length) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(result.rows[0]);
    
  }catch(e){
    res.status(500).json({ message: 'Ошибка сервера' });
  }


}


exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await pool.query(
      'SELECT id, username, email, points, avatar, created_at FROM users WHERE id = $1',
      [userId]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(result.rows[0]);
  } catch (e) {
    console.error("Get user profile error:", e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};


exports.getPoints = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await pool.query('SELECT points FROM users WHERE id = $1', [userId]);
    if (!result.rows.length) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json({ points: result.rows[0].points });
  } catch (e) {
    console.error("Get user points error:", e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};






// Функция для смены пароля
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Текущий и новый пароли обязательны' });
  }

  try {
    // Проверяем текущий пароль
    const userId = req.user.id;
    const result = await pool.query('SELECT password FROM users WHERE id = $1', [userId]); 
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const isMatch = await bcrypt.compare(currentPassword, result.rows[0].password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Текущий пароль неверный' });
    }

    // Хешируем новый пароль
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Обновляем пароль в базе данных
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, userId]);

    res.json({ message: 'Пароль успешно изменен' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка на сервере' });
  }
};
