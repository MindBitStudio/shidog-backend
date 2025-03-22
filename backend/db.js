const { Pool } = require('pg');

const pool = new Pool({
connectionString: process.env.DATABASE_URL,
ssl: {
    rejectUnauthorized: false // Necesario para conexiones seguras en Render
}
});

module.exports = pool;
