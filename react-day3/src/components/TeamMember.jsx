function TeamMember({ member, onToggle }) {
  const { id, name, role, available } = member;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        marginBottom: "10px",
        padding: "10px",
        borderRadius: "8px",
        background: available ? "#79f779ff" : "rgba(250, 113, 113, 1)",
      }}
    >
      <h3>{name}</h3>
      <p>{role}</p>
      <button onClick={() => onToggle(id)}>
        {available ? "Mark Unavailable" : "Mark Available"}
      </button>
    </div>
  );
}

export default TeamMember;
