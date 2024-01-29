import { useState, useEffect } from 'react';

import personService from './services/persons';

import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Person from './components/Person';
import Notification from './components/Notification';

import './index.css';

const Persons = ({ persons, onRemove }) => {
  return (
    <>
      {persons.map((person) => {
        return (
          <div key={person.id} style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
            <button onClick={() => onRemove(person.id)} style={{ marginRight: '10px' }}>
              delete
            </button>
            <Person person={person} />
          </div>
        );
      })}
    </>
  );
};

const initialNotification = {
  message: null,
  type: null,
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchName, setSearchName] = useState('');
  const [notification, setNotification] = useState(initialNotification);

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
      handleUpdatePerson(persons.find((person) => person.name === newName).id);
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };

    personService
      .create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNotification({
          message: `Added ${returnedPerson.name}`,
          type: 'success',
        });
        setTimeout(() => {
          setNotification(initialNotification);
        }, 5000);
      })
      .catch((error) => {
        console.log(error.response.data.error);
        setNotification({
          message: `${error.response.data.error}`,
          type: 'error',
        });
        setTimeout(() => {
          setNotification(initialNotification);
        }, 5000);
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
          setNotification({
            message: `Removed ${person.name}`,
            type: 'success',
          });
          setTimeout(() => {
            setNotification(initialNotification);
          }, 5000);
        })
        .catch((_) => {
          setNotification({
            message: `${person.name} has already been removed from server`,
            type: 'error',
          });
          setTimeout(() => {
            setNotification(initialNotification);
          }, 5000);

          setPersons(persons.filter((person) => person.id !== id));
        });
    }
  };

  const handleUpdatePerson = (id) => {
    const person = persons.find((person) => person.id === id);
    const result = window.confirm(
      `${person.name} is already added to phonebook, replace the old number with a new one?`
    );

    if (result) {
      const personObject = {
        name: person.name,
        number: newNumber,
      };

      personService
        .update(id, personObject)
        .then((returnedPerson) => {
          setPersons(persons.map((person) => (person.id !== id ? person : returnedPerson)));
          setNotification({
            message: `Updated ${returnedPerson.name}`,
            type: 'success',
          });
          setTimeout(() => {
            setNotification(initialNotification);
          }, 5000);
        })
        .catch((_) => {
          setNotification({
            message: `${person.name} could not be updated`,
            type: 'error',
          });
          setTimeout(() => {
            setNotification(initialNotification);
          }, 5000);

          setPersons(persons.filter((person) => person.id !== id));
        });

      // reset input fields
      setNewName('');
      setNewNumber('');
    }
  };

  const shownPersons = persons.filter((person) => {
    return person.name.toLowerCase().includes(searchName.toLowerCase());
  });

  return (
    <>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
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
