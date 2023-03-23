import { useState } from "react";
import { useEffect } from "react";

const Form = (props) => {
  const {
    initialAnimal = {
      id_animal: null,
      nickname: "",
      animal_record_timestamp: "",
      date_of_sighting: "",
      time_of_sighting: "",
      location_of_sighting: "",
      sighter_email: "",
      health: "",
    },
  } = props;

  // This is the oroginal State with not initial student
  const [animal, setAnimal] = useState(initialAnimal);
  const [species, setSpecies] = useState([]);
  //UseEffect is a way to run asynchronous function but put it at bottom

  //create functions that handle the event of the user typing into the form
  const handleNicknameChange = (event) => {
    const nickname = event.target.value;
    setAnimal((animal) => ({ ...animal, nickname }));
  };

  const handleSpeciesChange = (event) => {
    const species_name = event.target.value;
    setAnimal((animal) => ({ ...animal, species_name }));
  };

  const handleTimestampChange = (event) => {
    const animal_record_timestamp = event.target.value;
    setAnimal((animal) => ({ ...animal, animal_record_timestamp }));
  };

  const handleDateOfSightingChange = (event) => {
    const date_of_sighting = event.target.value;
    setAnimal((animal) => ({ ...animal, date_of_sighting }));
  };

  const handleTimeOfSightingChange = (event) => {
    const time_of_sighting = event.target.value;
    setAnimal((animal) => ({ ...animal, time_of_sighting }));
  };

  const handleLocationOfSightingChange = (event) => {
    const location_of_sighting = event.target.value;
    setAnimal((animal) => ({ ...animal, location_of_sighting }));
  };

  const handleSighterEmailChange = (event) => {
    const sighter_email = event.target.value;
    setAnimal((animal) => ({ ...animal, sighter_email }));
  };

  const handleHealthChange = (event) => {
    const health = event.target.value;
    setAnimal((animal) => ({ ...animal, health }));
  };

  //A function to handle the post request  *** changed to animalandsighting instead of animals ??? ))))))))))))))))
  const postAnimal = (newAnimal) => {
    console.log("I am in my postrequest");
    return fetch("http://localhost:8085/api/animalandsighting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAnimal),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("From the post ", data);
        console.log("postAnimal is working");
        props.saveAnimal(data);
      });
  };

  //A function to handle the Update request
  const updateAnimal = (existingAnimal) => {
    return fetch(`http://localhost:8085/api/animals/${existingAnimal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(existingAnimal),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("From put request ", data);
        props.saveAnimal(data);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (animal.id_animal) {
      updateAnimal(animal);
    } else {
      postAnimal(animal);
    }
  };

  //******Do a fetch to get the species database here! Get request
  //This function doesnt need parameters! Cuz it can function and run and get the data without any parameter
  const getSpecies = () => {
    return fetch(`http://localhost:8085/api/species`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("From species get request ", data);
        //save variables in state!!!!
        setSpecies(data);
      });
  };

  useEffect(() => {
    getSpecies();
  }, []); //empty depedency array will run after component mounted

  //Put Use effect after function is declared
  //fetch is asychrounous operation, can do asychn in the main body of the component- the whole function!

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <label>Animal Name</label>
        <select
          id="add-animal-name"
          placeholder="Animal Name"
          required
          value={animal.nickname}
          onChange={handleNicknameChange}
        >
          {props.animals.map((animal) => {
            return <option value={animal.nickname}>{animal.nickname} </option>;
          })}
          {/* invalid value so wont affect the base! so put -1 */}
          <option value={-1}> Create New Animal option</option>
        </select>

        <label>
          Species
          <select
            id="species-name"
            placeholder="Species Name"
            required
            value={species.species_name}
            // onChange={handleNicknameChange}
          >
            {/* route on backend to return all species!!! an array of all ur species, use a map to return an option for each species */}
            {/* map also takes an arrow function!! */}
            {/* Arrow function needs to return something!! return option tag because thats what we want to show up */}
            {species.map((element) => {
              return (
                <option value={element.id_species}>
                  {element.species_name}{" "}
                </option>
              );
            })}
          </select>
        </label>

        <label>Date of Sighting </label>
        <input
          type="date"
          id="add-date-of-sighting"
          placeholder="Date of Sighting"
          required
          value={animal.date_of_sighting}
          onChange={handleDateOfSightingChange}
        />

        <label>Time of Sighting </label>
        <input
          type="time"
          id="add-time-of-sighting"
          placeholder="Time of Sighting"
          required
          value={animal.time_of_sighting}
          onChange={handleTimeOfSightingChange}
        />

        <label>Location of Sighting </label>
        <input
          type="text"
          id="add-location-of-sighting"
          placeholder="Location of Sighting"
          required
          value={animal.location_of_sighting}
          onChange={handleLocationOfSightingChange}
        />

        <label>Health </label>
        <input
          type="text"
          id="add-health"
          placeholder="Health"
          required
          value={animal.health}
          onChange={handleHealthChange}
        />
      </fieldset>
      <button type="submit">{!animal.id_animal ? "ADD" : "SAVE"}</button>
    </form>
  );
};

export default Form;
