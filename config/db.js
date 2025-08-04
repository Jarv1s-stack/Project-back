const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://ayan:O72akEpA1Z3IEYwiQzS8wkdRel00JjAv@dpg-d288ptp5pdvs738ag9q0-a.oregon-postgres.render.com/eventmate_1438',
    ssl: { rejectUnauthorized: false }
});


module.exports = pool;
