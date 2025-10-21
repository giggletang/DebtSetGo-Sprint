import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const db = await mysql.createPool({
  host: process.env.MYSQL_HOST || "mysql",
  user: process.env.MYSQL_USER || "debtuser",
  password: process.env.MYSQL_PASSWORD || "debtpass",
  database: process.env.MYSQL_DB || "debtsetgo",
  waitForConnections: true,
  connectionLimit: 10
});

console.log("✅ Connected to MySQL");
