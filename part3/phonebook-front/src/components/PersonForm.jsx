export default function PersonForm({ name, number, onNameChange, onNumberChange, onSubmit }) {
  return (
    <form>
      <div>
        name: <input value={name} onChange={onNameChange} />
      </div>
      <div>
        number: <input value={number} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit" onClick={onSubmit}>
          add
        </button>
      </div>
    </form>
  );
}
