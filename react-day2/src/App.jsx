import Welcome from "./components/welcome";
import UserCard from "./components/UserCard";
import Counter from "./components/Counter";

function App() {
  return (
    <div>
      <h1
        style={{
          width: "100%",
          padding: "10px",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        Day 2: React Fundamental
      </h1>
      <Welcome name="Raj" />
      <Welcome name="Ram" />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        <UserCard
          name="Raj"
          age={34}
          profession="FrontEnd Developer"
          experience="10 Years"
        />
        <UserCard
          name="Ram"
          age={28}
          profession="Backend Developer"
          experience={"5 Years"}
        />
        <UserCard
          name="Rakesh"
          age={39}
          profession="Senior Developer"
          experience="18 Years"
        />
        <UserCard
          name="Ranveer"
          age={22}
          profession="UI Developer"
          experience={"2 Years"}
        />
      </div>
      <div
        style={{
          width: "100%",
          padding: "10px",
          justifyContent: "center",
          textAlign: "center",
          fontSize: "30px",
        }}
      >
        <Counter />
      </div>
    </div>
  );
}
export default App;
