const pool = require('../config/db');

// Валидация даты
function isValidDate(dateString) {
  return !isNaN(Date.parse(dateString));
}

// Выйти из события
exports.leaveEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Проверяем, что пользователь уже в списке участников
    const exists = await pool.query(
      'SELECT * FROM event_participants WHERE event_id = $1 AND user_id = $2',
      [id, userId]
    );
    if (!exists.rows.length) {
      return res.status(400).json({ message: 'Вы не участвуете в этом событии' });
    }

    // Удаляем запись о его участии
    await pool.query(
      'DELETE FROM event_participants WHERE event_id = $1 AND user_id = $2',
      [id, userId]
    );

    res.json({ message: 'Вы успешно вышли из события' });
  } catch (e) {
    console.error('Leave event error:', e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};


// Создать событие (автор сразу участник)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const userId = req.user.id;

    if (!title || !description || !isValidDate(date)) {
      return res.status(400).json({ message: 'Некорректные данные события' });
    }

    // Создаём событие
    const eventRes = await pool.query(
      'INSERT INTO events (title, description, date, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, date, userId]
    );
    const event = eventRes.rows[0];

    // Добавляем автора в участники (ON CONFLICT — защита от дубля)
    await pool.query(
      'INSERT INTO event_participants (event_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [event.id, userId]
    );

    // Получаем участников (у автора он будет один — сам)
    const participantsRes = await pool.query(
      `SELECT users.id, users.username
       FROM event_participants
       JOIN users ON users.id = event_participants.user_id
       WHERE event_participants.event_id = $1`,
      [event.id]
    );
    event.participants = participantsRes.rows;

    res.status(201).json(event);
  } catch (e) {
    console.error('Create event error:', e);
    res.status(500).json({ message: 'Ошибка при создании события' });
  }
};

// Получить все актуальные события (ещё не прошли)
exports.getEvents = async (req, res) => {
  try {
    const now = new Date();
    const eventsRes = await pool.query(
      'SELECT * FROM events WHERE date > $1 ORDER BY date ASC',
      [now]
    );
    const events = eventsRes.rows;

    // Для оптимизации здесь НЕ добавляем участников к каждому событию — фронт получает только основную инфу
    res.json(events);
  } catch (e) {
    console.error("Get events error:", e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить событие по id (с массивом участников)
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const eventRes = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if (!eventRes.rows.length) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }
    const event = eventRes.rows[0];

    // Обязательный запрос к участникам!
    const participantsRes = await pool.query(
      `SELECT users.id, users.username
       FROM event_participants
       JOIN users ON users.id = event_participants.user_id
       WHERE event_participants.event_id = $1`,
      [id]
    );
    event.participants = participantsRes.rows;

    res.json(event);
  } catch (e) {
    console.error("Get event by id error:", e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};




// Удалить событие (только владелец)
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const event = await pool.query('SELECT * FROM events WHERE id = $1 AND user_id = $2', [id, userId]);
    if (!event.rows.length) {
      return res.status(403).json({ message: 'Нет доступа для удаления' });
    }
    await pool.query('DELETE FROM events WHERE id = $1', [id]);
    res.json({ message: 'Событие удалено' });
  } catch (e) {
    console.error("Delete event error:", e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Присоединиться к событию
exports.joinEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const exist = await pool.query(
      'SELECT 1 FROM event_participants WHERE event_id = $1 AND user_id = $2',
      [id, userId]
    );
    if (exist.rows.length) {
      return res.status(409).json({ message: 'Вы уже участник этого события' });
    }
    await pool.query(
      'INSERT INTO event_participants(event_id, user_id) VALUES($1, $2)',
      [id, userId]
    );
    res.json({ message: 'Вы присоединились к событию' });
  } catch (e) {
    console.error("Join event error:", e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};



