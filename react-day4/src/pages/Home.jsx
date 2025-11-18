import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h2>Welcome</h2>
      <p>
        This is a small Todo demo. Go to <Link to="/todos">Todos</Link> to
        manage tasks.
      </p>
    </div>
  );
}
