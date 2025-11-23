const { Pool } = require("@neondatabase/serverless");
global.WebSocket = require("ws");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;

