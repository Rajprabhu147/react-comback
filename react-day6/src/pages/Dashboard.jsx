import { useUser } from "../context/UserContext";
import { useSkills, useAddSkill, useDeleteSkill } from "../hooks/useSkills";
import SkillForm from "../components/SkillForm";
import SkillList from "../components/SkillList";

export default function Dashboard() {
  const { user, loading: userLoading } = useUser();
  const { data: skills = [], isLoading, isError } = useSkills();
  const addSkill = useAddSkill();
  const deleteSkill = useDeleteSkill();

  if (userLoading) return <p>Setting up user...</p>;
  if (!user) return <p>Please login to see your skills.</p>;
  if (isLoading) return <p>Loading skills...</p>;
  if (isError) return <p>Error fetching skills</p>;

  return (
    <div>
      <h2>Your Skills</h2>
      <section className="max-w-3xl mx-auto my-6 bg-slate-50 p-6 rounded-2xl shadow-inner">
        <SkillForm onAdd={(name, level) => addSkill.mutate({ name, level })} />
      </section>

      <SkillList skills={skills} onDelete={(id) => deleteSkill.mutate(id)} />
    </div>
  );
}
