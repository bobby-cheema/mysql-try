import mysql from "mysql2";

import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    // host: "localhost",
    // user: "root",
    // password: "laddo123",
    // database: "my_db",
  })
  .promise();
export async function getNotes() {
  const [rows] = await pool.query("SELECT * FROM user");
  return rows;
}
// return authID

export async function getAuthID(fbID) {
  const AuthID = await pool.query(` SELECT * FROM user where fb_id=?  `, [
    fbID,
  ]);
  console.log("fromdb ", AuthID[0]);
  return AuthID[0];
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

// getNotes();
//mysql://b4ec1a889e974c:2ee55f0b@us-cdbr-east-06.cleardb.net/heroku_a2b76d2c94b8a3f?reconnect=true
