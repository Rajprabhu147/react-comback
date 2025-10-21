import React from "react";
import { Link } from "react-router-dom";

export default function Profiles({ profiles }) {
  return (
    <div>
      <h2>Profiles</h2>
      {profiles.length === 0 ? (
        <p>
          No profiles yet. Go to <Link to="/add">Add Profile</Link> to create on
        </p>
      ) : (
        <ul>
          {profiles.map((p) => (
            //link creates client side rendering and client side navigation
            //key={p.id} endures rendering stability
            <li key={p.id}>
              <Link to={`/profiles/${p.id}`}>{p.name}</Link> -{p.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
