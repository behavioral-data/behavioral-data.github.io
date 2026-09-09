export default function PersonPhoto({ person, loading }) {
  const photo = <img src={person.image} alt={person.name} loading={loading} />;
  return person.id === 'advaitbhat'
    ? <div className="cropped-headshot">{photo}</div>
    : photo;
}
