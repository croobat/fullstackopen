import { useState } from 'react';

const App = () => {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas', number: '1234567890', id: 1 }]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

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
      id: persons.length + 1,
    };
    setPersons(persons.concat(personObject));

    // reset the input fields
    setNewName('');
    setNewNumber('');
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <div>debug: {newNumber}</div>
      <form>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit" onClick={handleAddPerson}>
            add
          </button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) => {
        return <div key={person.id}>{person.name} {person.number}</div>;
      })}
    </div>
  );
};

export default App;
