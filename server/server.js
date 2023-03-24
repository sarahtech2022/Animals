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

//** NEW Get request getting all the data in one object: */
app.get("/api/animals", cors(), async (req, res) => {
  try {
    const { rows: animal } = await db.query(
      "SELECT * FROM sightings LEFT JOIN animal ON sightings.id_animal=animal.id_animal"
    );
    res.send(animal);
  } catch (e) {
    return res.status(400).json({ e });
  }
});

//***Is a DB query to get our species from the species table so we can use it in our drop down
app.get("/api/species", cors(), async (req, res) => {
  try {
    const { rows: species } = await db.query(
      //give me the rows from the result of that query
      "SELECT * FROM species"
    );
    res.send(species);
  } catch (e) {
    return res.status(400).json({ e });
  }
});

// create the get request
// app.get("/api/animals", cors(), async (req, res) => {
//   // const STUDENTS = [

//   //     { id: 1, firstName: 'Lisa', lastName: 'Lee' },
//   //     { id: 2, firstName: 'Eileen', lastName: 'Long' },
//   //     { id: 3, firstName: 'Fariba', lastName: 'Dadko' },
//   //     { id: 4, firstName: 'Cristina', lastName: 'Rodriguez' },
//   //     { id: 5, firstName: 'Andrea', lastName: 'Trejo' },
//   // ];
//   // res.json(STUDENTS);
//   try {
//     const { rows: animal } = await db.query("SELECT * FROM animal");
//     res.send(animal);
//   } catch (e) {
//     return res.status(400).json({ e });
//   }
// });

// //*******Creating our New get request to get the data from the sighting table!

// app.get("/api/sightings", cors(), async (req, res) => {
//   try {
//     const { rows: sightings } = await db.query("SELECT * FROM sightings");
//     res.send(sightings);
//   } catch (e) {
//     return res.status(400).json({ e });
//   }
// });

// create the POST request
//WILL redo this so we used Pool/Transactions ********////////////////////////////////***************
// app.post("/api/animals", cors(), async (req, res) => {
//   console.log("working");
//   const newAnimal = {
//     nickname: req.body.nickname,
//     animal_record_timestamp: req.body.animal_record_timestamp,
//     species_name: req.body.species_name,
//     date_of_sighting: req.body.date_of_sighting,
//     time_of_sighting: req.body.time_of_sighting,
//     location_of_sighting: req.body.location_of_sighting,
//     sighter_email: req.body.sighter_email,
//     health: req.body.health,
//   };
//   console.log([
//     newAnimal.nickname,
//     newAnimal.animal_record_timestamp,
//     newAnimal.species_name,
//     newAnimal.date_of_sighting,
//   ]);
//   const result = await db.query(
//     //How to manage post with two tables- this is probably my error
//     "INSERT INTO animal(nickname, animal_record_timestamp) VALUES($1, $2) RETURNING *",
//     "INSERT INTO sightings(date_of_sighting, time_of_sighting, location_of_sighting, sighter_email, health) VALUES($1, $2, $3, $4, $5) RETURNING *",
//     [(newAnimal.nickname, newAnimal.animal_record_timestamp)][
//       (newAnimal.date_of_sighting,
//       newAnimal.time_of_sighting,
//       newAnimal.location_of_sighting,
//       newAnimal.sighter_email,
//       newAnimal.health)
//     ]
//   );
//   console.log(result.rows[0]);
//   res.json(result.rows[0]);
// });
//****************************************** */

//****************************************************************** */
//Transaction with Dana's help!!!
app.post("/api/animalandsighting", cors(), async (req, res) => {
  const client = await db.connect();

  try {
    //Automatically generating the id_animal coloumn and the animal record timestamp so not needed!
    await client.query("BEGIN");
    const insertAnimal = ` 
      INSERT INTO animal(nickname, id_species)
      VALUES($1, $2)
      RETURNING id_animal
    `;
    const newAnimal = await client.query(insertAnimal, [
      // can use newAnimal because thats whats returning id_animal
      req.body.nickname,
      req.body.id_species,
      // newAnimal.rows[0].id_animal, (Not needed here, because anything that is in that arrray should coorspond to the query)
    ]);

    const insertSighting = `
      INSERT INTO sightings(date_of_sighting, id_animal, time_of_sighting, location_of_sighting, health, sighter_email)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING id_sighting
    `;
    await client.query(insertSighting, [
      req.body.date_of_sighting,
      newAnimal.rows[0].id_animal,
      req.body.time_of_sighting,
      req.body.location_of_sighting,
      req.body.health,
      req.body.sighter_email,
    ]);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e.message);
  } finally {
    client.release();
  }
  res.status(200).json({ message: "New sighting was added successfully" });
});

//********************************************************************** */

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
