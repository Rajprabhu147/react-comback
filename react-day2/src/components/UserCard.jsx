function UserCard({ name, age, profession, experience }) {
  return (
    <div
      style={{
        fontSize: "25px",
        border: "20px solid gray",
        padding: "20px",
        margin: "10px",
        backgroundColor: "Teal",
        color: " white",
        textAlign: "center",
        borderRadius: "12px",
        flex: "1 1 250px",
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
