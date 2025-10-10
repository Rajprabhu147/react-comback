import TeamMember from "./TeamMember";

function TeamList({ team, onToggle }) {
  return (
    <div>
      {team.map((member) => (
        <TeamMember key={member.id} member={member} onToggle={onToggle} />
      ))}
    </div>
  );
}

export default TeamList;
