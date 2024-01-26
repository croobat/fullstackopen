export default function Person({ person }) {
  return (
    <div key={person.id}>
      {person.name} {person.number}
    </div>
  );
}
