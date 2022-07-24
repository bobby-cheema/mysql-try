import mysql from "mysql2";

import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    port: process.env.PORT,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export async function getNotes() {
  const [rows] = await pool.query("SELECT * FROM user");
  console.log(rows);
  return rows;
}

// export async function getNote(id) {
//   const [rows] = await pool.query(`
//   SELECT *
//   FROM notes
//   WHERE id = ?
//   `, [id])
//   return rows[0]
// }

// export async function createNote(title, contents) {
//   const [result] = await pool.query(`
//   INSERT INTO notes (title, contents)
//   VALUES (?, ?)
//   `, [title, contents])
//   const id = result.insertId
//   return getNote(id)
// }

getNotes();
// mysql://b4ec1a889e974c:2ee55f0b@us-cdbr-east-06.cleardb.net/heroku_a2b76d2c94b8a3f?reconnect=true

DB_url: mysql://b4ec1a889e974c:2ee55f0b@us-cdbr-east-06.cleardb.net/heroku_a2b76d2c94b8a3f?reconnect=true