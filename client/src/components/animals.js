import { useState, useEffect } from "react";
import Form from "./form";

function Animals() {
  // this is my original state with an array of students
  const [animals, setAnimals] = useState([]);

  // New State to contro the existing student Id that the user wants to edit
  const [editAnimalId, setEditAnimalId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8085/api/animals")
      .then((response) => response.json())
      .then((animals) => {
        setAnimals(animals);
      });
  }, []);

  const addAnimal = (newAnimal) => {
    //console.log(newStudent);
    //postStudent(newStudent);
    setAnimals((animals) => [...animals, newAnimal]);
  };

  //A function to control the update in the parent (student component)

  const updateAnimal = (savedAnimal) => {
    console.log("Line 29 savedAnimal", savedAnimal);
    // This function should update the whole list of students -
    setAnimals((animals) => {
      const newArrayAnimals = [];
      for (let animal of animals) {
        if (animal.id === savedAnimal.id) {
          newArrayAnimals.push(savedAnimal);
        } else {
          newArrayAnimals.push(animal);
        }
      }
      return newArrayAnimals;
    });
    // This line is only to close the form;
    setEditAnimalId(null);
  };

  const onEdit = (animal) => {
    console.log("This is line 26 on animal component", animal);
    const editingID = animal.id;
    console.log("Just the animal id", animal.id);
    setEditAnimalId(editingID);
  };

  return (
    <div className="animals">
      <h2> List of Animals </h2>
      <ul>
        {animals.map((animal) => {
          if (animal.id_animal === editAnimalId) {
            //something needs to happento allow the user edit that existing student
            // At some point I need to pass the update function as props - connect this to the backend
            return <Form initialAnimal={animal} saveAnimal={updateAnimal} />;
          } else {
            return (
              <li key={animal.id_animal}>
                {animal.nickname}{" "}
                <button
                  key={animal.id_animal}
                  type="button"
                  onClick={() => {
                    onEdit(animal);
                  }}
                >
                  EDIT
                </button>
              </li>
            );
          }
        })}
      </ul>
      <Form saveAnimal={addAnimal} />
    </div>
  );
}

export default Animals;
