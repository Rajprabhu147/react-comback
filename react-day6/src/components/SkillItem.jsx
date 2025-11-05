export default function SkillItem({ skill, onDelete }) {
  return (
    <li style={{ marginBottom: 8 }}>
      {skill.name} — <em>{skill.level}</em>
      <button onClick={onDelete} style={{ marginLeft: 8 }}>
        ❌
      </button>
    </li>
  );
}
