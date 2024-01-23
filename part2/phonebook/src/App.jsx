import { useState, useEffect } from 'react';
import axios from 'axios';

import personService from './services/persons';

import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Person from './components/Person';

const Persons = ({ persons, onRemove }) => {
  return (
    <>
      {persons.map((person) => {
        return (
          <div key={person.id} style={{ display: 'flex' }}>
            <button onClick={() => onRemove(person.id)}>delete</button>
            <Person person={person} />
          </div>
        );
      })}
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleSearchName = (event) => {
    setSearchName(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleAddPerson = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };

    personService.create(personObject).then((returnedPerson) => {
      console.log('hola');
      setPersons(persons.concat(returnedPerson));
    });

    // reset input fields
    setNewName('');
    setNewNumber('');
  };

  const handleRemovePerson = (id) => {
    const person = persons.find((person) => person.id === id);
    const result = window.confirm(`Delete ${person.name}?`);

    if (result) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          alert(`the person '${person.name}' was already deleted from server\n${error}`);
          setPersons(persons.filter((person) => person.id !== id));
        });
    }
  };

  const shownPersons = persons.filter((person) => {
    return person.name.toLowerCase().includes(searchName.toLowerCase());
  });

  return (
    <>
      <h2>Phonebook</h2>
      <Filter name={searchName} onChange={handleSearchName} />

      <h3>Add a new</h3>
      <PersonForm
        name={newName}
        number={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onSubmit={handleAddPerson}
      />

      <h3>Numbers</h3>
      <Persons persons={shownPersons} onRemove={handleRemovePerson} />
    </>
  );
};

export default App;
