function UserCard({ name, age, profession, experience }) {
  return (
    <div
      style={{
        fontSize: "25px",
        border: "20px solid gray",
        padding: "5%",
        margin: "5%",
      }}
    >
      <h3>{name}</h3>
      <p>Age: {age}</p>
      <p>Profession: {profession} </p>
      <p>Experience: {experience} </p>
    </div>
  );
}
export default UserCard;
