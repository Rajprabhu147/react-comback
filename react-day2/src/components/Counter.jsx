import { useState } from "react";
function Counter({ initial = 0 }) {
  const [count, setCount] = useState(0);
  return (
    <div
      style={{
        width: "100%",
        textAlign: "center",
        fontSize: "25px",
        padding: "20px",
      }}
    >
      <p>Count : {count} </p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <br />
      <button onClick={() => setCount(initial)}>Reset</button>
      <br />

      <button onClick={() => setCount(Math.max(0, count - 1))}>
        Decrement
      </button>
    </div>
  );
}

export default Counter;
