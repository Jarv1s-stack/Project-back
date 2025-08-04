const cron = require('node-cron');
const pool = require('../config/db');

// Сколько начислять points участникам
const REWARD_POINTS = 5;

async function rewardAndDeletePastEvents() {

  const now = new Date();
  const prevMinute = new Date(now.getTime() - 60 * 1000);
  try {
    const eventsRes = await pool.query(
      `SELECT id FROM events WHERE date > $1 AND date <= $2`,
      [prevMinute, now]
    );
    const events = eventsRes.rows;

    for (const event of events) {

      const participantsRes = await pool.query(
        `SELECT user_id FROM event_participants WHERE event_id = $1`,
        [event.id]
      );
      const participants = participantsRes.rows;

      // Начислить points каждому участнику
      for (const p of participants) {
        await pool.query(
          `UPDATE users SET points = points + $1 WHERE id = $2`,
          [REWARD_POINTS, p.user_id]
        );
      }
      // Удалить событие (и связанные записи по ON DELETE CASCADE)
      await pool.query(`DELETE FROM events WHERE id = $1`, [event.id]);
    }
    if (events.length) {
      console.log(`Обработано ${events.length} завершённых событий, начислены points, удалены события.`);
    }
  } catch (e) {
    console.error('Ошибка автоначисления/удаления ивентов:', e.message);
  }
}

// Каждую минуту проверять события
cron.schedule('* * * * *', rewardAndDeletePastEvents);

module.exports = { rewardAndDeletePastEvents };
