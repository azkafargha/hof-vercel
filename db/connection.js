const { Pool } = require("pg");

const pool = new Pool({
  // local
  user: "postgres",
  host: "localhost",
  database: "db_hof",
  password: "admin",
  port: 5432,

  // deployed
  //   connectionString: process.env.DB_URL,
});

module.exports = pool;
