export default function PersonPhoto({ person, loading }) {
  const { scale = 1, x = 50, y = 50 } = person.photoCrop || {};
  return (
    <div className="person-photo">
      <img
        src={person.image}
        alt={person.name}
        loading={loading}
        style={{ transform: `scale(${scale})`, transformOrigin: `${x}% ${y}%` }}
      />
    </div>
  );
}
