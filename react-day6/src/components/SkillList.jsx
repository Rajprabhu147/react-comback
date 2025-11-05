import SkillItem from "./SkillItem";

export default function SkillList({ skills, onDelete }) {
  if (!skills.length) return <p>No skills yet.</p>;
  return (
    <ul>
      {skills.map((s) => (
        <SkillItem key={s.id} skill={s} onDelete={() => onDelete(s.id)} />
      ))}
    </ul>
  );
}
