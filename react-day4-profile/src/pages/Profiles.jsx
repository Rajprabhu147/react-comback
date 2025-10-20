import React from "react";
import { Link } from "react-router-dom";

export default function Profiles({ profiles }) {
  return (
    <div>
      <h2>Profiles</h2>
      {profiles.length === 0 ? (
        <p>No profiles yet.</p>
      ) : (
        <ul>
          {profiles.map((p) => (
            <li key={p.id}>
              <Link to={`/profiles/${p.id}`}>{p.name}</Link> -{p.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
