import { useState } from "react";
function Counter({ initial = 0, max = 50 }) {
  const [count, setCount] = useState(0);

  // Check is count have reached max
  const isMaxReached = count >= max;
  return (
    <div className="counter">
      <p>Count : {count} </p>
      {/* 🚀 Increment Button (disabled at max) */}

      <button
        onClick={() => !isMaxReached && setCount(count + 5)}
        disabled={isMaxReached}
      >
        Increment
      </button>
      {/* 🔄 Reset Button */}

      <button onClick={() => setCount(initial)}>Reset</button>
      {/* ⬇️ Decrement Button (no negatives) */}

      <button onClick={() => setCount(Math.max(0, count - 5))}>
        Decrement
      </button>
      {/* 👀 Optional status message */}

      {isMaxReached && <p style={{ color: "red" }}>max limit reached!</p>}
    </div>
  );
}

export default Counter;
