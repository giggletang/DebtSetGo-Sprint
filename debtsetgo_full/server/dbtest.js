import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "mysql",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "debtuser",
      password: process.env.DB_PASSWORD || "debtpass",
      database: process.env.DB_NAME || "debtsetgo",
      ssl: { rejectUnauthorized: false },
    });

    const [rows] = await connection.query("SELECT DATABASE() AS db, NOW() AS time_now");
    console.log("✅ Connected successfully!");
    console.table(rows);

    await connection.end();
  } catch (err) {
    console.error("❌ Database connection failed:");
    console.error(err.message);
    process.exit(1);
  }
})();

