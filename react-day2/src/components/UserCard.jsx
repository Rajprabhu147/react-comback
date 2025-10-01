function UserCard({ name, age, profession }) {
  return (
    <div style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
      <h3>{name}</h3>
      <p>Age: {age}</p>
      <p>Profession: {profession} </p>
    </div>
  );
}
export default UserCard;
