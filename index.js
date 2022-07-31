import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import {
  getNotes,
  getAuthID,
  createRunsheet,
  getsheets,
  deleteid,
  getsheetsbydate,
  getAllusers,
  getLastWeekHrs,
  getAllUnapprove,
  approveOne,
  updateAndApprove,
  getHrsLastWeek,
} from "./database.js";

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

//enable this when you are listening on local port
//let port = 3000;
let port = process.env.PORT || 80;
app.get("/notes", async (req, res) => {
  const notes = await getNotes();
  res.send(notes);
});

//get hours for last week
app.get("/hrslastweek", async (req, res) => {
  const hrs = await getHrsLastWeek();
  res.send(hrs);
});

// update approve one
app.put("/approveOne/:runsheet_id", async (req, res) => {
  console.log("EXPRESS", req.params.runsheet_id);
  const Approve = await approveOne(req.params.runsheet_id);
  res.send(Approve);
});
// update runsheet for admin and approve it

app.put("/updateAndApprove", async (req, res) => {
  const { id, start, finish, rest } = req.body;
  const result = await updateAndApprove(id, start, finish, rest);
  console.log("id , start,finish,rest", id, start, finish, rest);
});

// get all unapproved
app.get("/allunapprove", async (req, res) => {
  const unapprove = await getAllUnapprove();
  res.send(unapprove);
});

// Return Hrs Lastweek for all users
app.get("/lastweekhrs", async (req, res) => {
  const lastweekhrs = await getLastWeekHrs();
  res.send(lastweekhrs);
});

// Return all users

app.get("/allusers", async (req, res) => {
  const allusers = await getAllusers();
  res.send(allusers);
});

// Return AuthID

app.get("/AuthID/:id", async (req, res) => {
  const authID = await getAuthID(req.params.id);
  console.log("to express", authID);
  res.send(authID);
});

//Add to runsheet
app.post("/AddRunsheet", async (req, res) => {
  const { startTime, finishTime, rest, comment, id } = req.body;
  //
  // res.status(201).send(note);
  console.log("got req to create ", req.body);
  const runsheet = await createRunsheet(
    startTime,
    finishTime,
    rest,
    comment,
    id
  );
  res.send("ok brother got your req");
});

//return all the sheets for a driver
app.get("/getsheets/:id", async (req, res) => {
  const result = await getsheets(req.params.id);
  console.log("to express from mysql", result);
  res.send(result);
});
// Delete one id

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const returnvalue = await deleteid(id);
  res.send(returnvalue);
});

// select runsheet by date
app.get("/getsheetsbydate/:start/:end/:id", async (req, res) => {
  //const result = await getsheets(req.params.id);
  //console.log("to express from mysql", result);

  const { start, end, id } = req.params;
  const result = await getsheetsbydate(start, end, id);
  res.send(result);
});

// app.get("/notes/:id", async (req, res) => {
//   const id = req.params.id
//   const note = await getNote(id)
//   res.send(note)
// })

// app.post("/notes", async (req, res) => {
//   const { title, contents } = req.body
//   const note = await createNote(title, contents)
//   res.status(201).send(note)
// })

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke 💩");
});

app.listen(port, () => {
  console.log("Server is running on port ", port);
});
