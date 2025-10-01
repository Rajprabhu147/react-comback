import Welcome from "./components/welcome";
import UserCard from "./components/UserCard";
import Counter from "./components/Counter";

function App() {
  return (
    <div>
      <h1>Day 2: React Fundamental</h1>
      <Welcome name="Raj" />
      <Welcome name="Prabhu" />

      <UserCard name="Raj" age={34} profession="FrontEnd Developer" />
      <UserCard name="Ram" age={28} profession="Backend Developer" />
      <Counter />
    </div>
  );
}
export default App;
