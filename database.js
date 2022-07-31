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
//  get lastweekhours
export async function getLastWeekHrs() {
  const lastweekhrs = await pool.query(`SELECT 
  TIMESTAMPDIFF(SECOND,
      runsheet.start,
      runsheet.finish) / (60 * 60) AS HRS,
  user.name,
  runsheet.start
FROM
  runsheet
      JOIN
  user ON runsheet.driver_fk = user.id
WHERE
  WEEK(runsheet.start) = WEEK(NOW()) - 1`);
  console.log("fromdb ", lastweekhrs[0]);
  return lastweekhrs[0];
}

// approve one

export async function approveOne(id) {
  const returnvalue = await pool.query(
    `UPDATE runsheet SET  approved=1  where  runsheet_id=?  `,
    [id]
  );
  console.log("fromdb ", returnvalue);
  return returnvalue;
}
//update and approve
export async function updateAndApprove(id, start, finish, rest) {
  const returnvalue = await pool.query(
    `UPDATE runsheet
    SET
    start =?,
    finish = ?,
    rest = ?
    WHERE runsheet_id = ?
    ;
     `,
    [start, finish, rest, id]
  );
  console.log("fromdb ", returnvalue);
  return returnvalue;
}

//get all runsheets unapproved so far
export async function getAllUnapprove() {
  const unapprove = await pool.query(` SELECT 
  runsheet.runsheet_id,
  runsheet.start,
  runsheet.finish,
  runsheet.rest,
  runsheet.approved,
  runsheet.driver_fk,
  runsheet.comment,
  user.name
FROM
  runsheet
      JOIN
  user ON runsheet.driver_fk = user.id
WHERE
  runsheet.approved = 0
ORDER BY user.name ASC
; `);
  console.log("fromdb ", unapprove[0]);
  return unapprove[0];
}

// getHrsLastWeek to get hours for the last week
export async function getHrsLastWeek() {
  const hrs = await pool.query(
    `SELECT 
    driver_fk, 
    user.name,
    abs(SUM(TIMEDIFF(start, finish))/10000) AS HRS
FROM
    runsheet
    join user on  runsheet.driver_fk=user.id
    where 
    
start >= DATE_SUB(curdate(),interval 1 WEEK )

GROUP BY driver_fk
ORDER BY HRS DESC;  `
  );
  console.log("fromdb ", hrs[0]);
  return hrs[0];
}

// get all date range sheets for a driver

export async function getsheetsbydate(start, end, id) {
  const sheets = await pool.query(
    ` SELECT * FROM runsheet where  driver_fk=? AND start >= ? AND finish <= ?  order by runsheet.start `,
    // ` SELECT * FROM runsheet where  driver_fk=? AND start between date(? ) and date(?)`,
    [id, start, end]
  );
  console.log("fromdb ", sheets[0]);
  return sheets[0];
}
// return all sheets  for a driver
export async function getsheets(id) {
  const sheets = await pool.query(
    ` SELECT * FROM runsheet where  driver_fk=?  `,
    [id]
  );
  console.log("fromdb ", sheets[0]);
  return sheets[0];
}

// get all users

export async function getAllusers() {
  const allusers = await pool.query(` SELECT * FROM user`);
  console.log("fromdb ", allusers[0]);
  return allusers[0];
}

//  delete one id

export async function deleteid(id) {
  const returnvalue = await pool.query(
    `DELETE  FROM runsheet where  runsheet_id=?  `,
    [id]
  );
  console.log("fromdb ", returnvalue);
  return returnvalue;
}

export async function createRunsheet(startTime, finishTime, rest, comment, id) {
  console.log("in func", startTime, finishTime, rest, id, comment);
  const [result] = await pool.query(
    `
  INSERT INTO runsheet (start,finish,rest,driver_fk, comment, approved)
  VALUES (?, ?,?,?,?,?)
  `,
    [startTime, finishTime, rest, id, comment, 0]
  );

  console.log(result.insertId);
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
