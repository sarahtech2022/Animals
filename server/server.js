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

//*******Creating our New get request to get the data from the sighting table!

app.get("/api/sightings", cors(), async (req, res) => {
  try {
    const { rows: sightings } = await db.query("SELECT * FROM sightings");
    res.send(sightings);
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
    species_name: req.body.species_name,
    date_of_sighting: req.body.date_of_sighting,
    time_of_sighting: req.body.time_of_sighting,
    location_of_sighting: req.body.location_of_sighting,
    sighter_email: req.body.sighter_email,
    health: req.body.health,
  };
  console.log([
    newAnimal.nickname,
    newAnimal.animal_record_timestamp,
    newAnimal.species_name,
    newAnimal.date_of_sighting,
  ]);
  const result = await db.query(
    "INSERT INTO animal(nickname, animal_record_timestamp) VALUES($1, $2) RETURNING *",
    "INSERT INTO sightings(date_of_sighting, time_of_sighting, location_of_sighting, sighter_email, health) VALUES($1, $2, $3, $4, $5) RETURNING *",
    [(newAnimal.nickname, newAnimal.animal_record_timestamp)][
      (newAnimal.date_of_sighting,
      newAnimal.time_of_sighting,
      newAnimal.location_of_sighting,
      newAnimal.sighter_email,
      newAnimal.health)
    ]
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
