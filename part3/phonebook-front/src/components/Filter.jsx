export default function Filter({name, onChange}) {
  return (
    <div>
      filter shown with <input value={name} onChange={onChange} />
    </div>
  );
}
