const pool = require('../config/db');

// Купить товар
exports.buyItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;

    // Проверка на существование товара
    const itemRes = await pool.query('SELECT id, price FROM shop WHERE id = $1', [itemId]);
    if (!itemRes.rows.length) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    const item = itemRes.rows[0];

    // Проверка points пользователя
    const userRes = await pool.query('SELECT points FROM users WHERE id = $1', [userId]);
    const points = userRes.rows[0].points;
    if (points < item.price) {
      return res.status(400).json({ message: 'Недостаточно points для покупки' });
    }

    await pool.query('UPDATE users SET points = points - $1 WHERE id = $2', [item.price, userId]);
    await pool.query('INSERT INTO purchases(user_id, shop_item_id) VALUES($1, $2)', [userId, item.id]);

    res.json({ message: 'Покупка успешна!' });
  } catch (e) {
    console.error("Buy item error:", e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};


exports.getMyPurchases = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT purchases.id, shop.name, shop.image_url, shop.description, shop.price, purchases.created_at
       FROM purchases
       JOIN shop ON shop.id = purchases.shop_item_id
       WHERE purchases.user_id = $1
       ORDER BY purchases.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (e) {
    console.error("Get purchases error:", e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
