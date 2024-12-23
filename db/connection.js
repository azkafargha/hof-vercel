const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: process.env.DB_URL,
  connectionString: process.env.TOKEN_SECRET,
});

module.exports = pool;