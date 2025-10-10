function TeamMember({ member, onToggle }) {
  const { id, name, role, available } = member;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        marginBottom: "10px",
        padding: "10px",
        borderRadius: "8px",
        background: available ? "#e0ffe0" : "#ffe0e0",
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
