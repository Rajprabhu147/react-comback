import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h2>Welcome</h2>
      <p>
        Simple Todo app to manage your tasks. Go to{" "}
        <Link to="/todos">Todos</Link> to see the app.
      </p>
    </div>
  );
}
