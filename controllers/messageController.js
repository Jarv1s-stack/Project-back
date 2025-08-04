const pool = require('../config/db');

// Получить сообщения события (без проверки на участие)
exports.getMessages = async (req, res) => {
  try {
    const { eventId } = req.params;
    const messages = await pool.query(
      `SELECT messages.id, messages.content, messages.created_at, users.username, users.id as sender_id
       FROM messages
       JOIN users ON users.id = messages.sender_id
       WHERE messages.event_id = $1
       ORDER BY messages.created_at ASC`,
      [eventId]
    );
    res.json(messages.rows);
  } catch (e) {
    console.error("Get messages error:", e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Отправить сообщение в чат события (разрешено любому залогиненному)
exports.sendMessage = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.length < 1 || content.length > 500) {
      return res.status(400).json({ message: 'Проверьте текст сообщения (1-500 символов)' });
    }

    // --- убрана проверка на участие! ---

    // Запись сообщения
    const result = await pool.query(
      'INSERT INTO messages(sender_id, event_id, content) VALUES($1, $2, $3) RETURNING id, content, created_at',
      [userId, eventId, content]
    );

    res.status(201).json({
      ...result.rows[0],
      username: req.user.username,
      sender_id: userId,
    });
  } catch (e) {
    console.error("Send message error:", e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
