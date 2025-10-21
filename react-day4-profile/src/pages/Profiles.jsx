import React from "react";
import { Link } from "react-router-dom";
import { useProfiles } from "./ProfilesContext";

export default function Profiles() {
  const { profiles } = useProfiles();
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
