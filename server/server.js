const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db/db-connection.js");

const app = express();

const PORT = 8085;
app.use(cors());
app.use(express.json());

// creates an endpoint for the route /api
app.get("/", (req, res) => {
  res.json({ message: "Hello from My template ExpressJS" });
});

// create the get request
app.get("/api/animals", cors(), async (req, res) => {
  // const STUDENTS = [

  //     { id: 1, firstName: 'Lisa', lastName: 'Lee' },
  //     { id: 2, firstName: 'Eileen', lastName: 'Long' },
  //     { id: 3, firstName: 'Fariba', lastName: 'Dadko' },
  //     { id: 4, firstName: 'Cristina', lastName: 'Rodriguez' },
  //     { id: 5, firstName: 'Andrea', lastName: 'Trejo' },
  // ];
  // res.json(STUDENTS);
  try {
    const { rows: animal } = await db.query("SELECT * FROM animal");
    res.send(animal);
  } catch (e) {
    return res.status(400).json({ e });
  }
});

// create the POST request
app.post("/api/animals", cors(), async (req, res) => {
  console.log("working");
  const newAnimal = {
    nickname: req.body.nickname,
    animal_record_timestamp: req.body.animal_record_timestamp,
  };
  console.log([newAnimal.nickname, newAnimal.animal_record_timestamp]);
  const result = await db.query(
    "INSERT INTO animal(nickname, animal_record_timestamp) VALUES($1, $2) RETURNING *",
    [newAnimal.nickname, newAnimal.animal_record_timestamp]
  );
  console.log(result.rows[0]);
  res.json(result.rows[0]);
});

//A put request - Update a student
app.put("/api/students/:studentId", cors(), async (req, res) => {
  console.log(req.params);
  //This will be the id that I want to find in the DB - the student to be updated
  const studentId = req.params.studentId;
  const updatedStudent = {
    id: req.body.id,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };
  console.log("In the server from the url - the student id", studentId);
  console.log(
    "In the server, from the react - the student to be edited",
    updatedStudent
  );
  // UPDATE students SET lastname = "something" WHERE id="16";
  const query = `UPDATE students SET lastname=$1, firstname=$2 WHERE id=${studentId} RETURNING *`;
  const values = [updatedStudent.lastname, updatedStudent.firstname];
  try {
    const updated = await db.query(query, values);
    console.log(updated.rows[0]);
    res.send(updated.rows[0]);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

// console.log that your server is up and running
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
