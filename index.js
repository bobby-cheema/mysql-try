import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { getNotes, getAuthID, createRunsheet, getsheets } from "./database.js";

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
