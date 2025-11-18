function UserCard({ name, age, bio, exp }) {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>Age: {age}</p>
      <p>Bio: {bio}</p>
      <p>Exp: {exp} </p>
    </div>
  );
}
export default UserCard;
