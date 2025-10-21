import React from "react";
import { useParams, Link } from "react-router-dom";
import { useProfiles } from "./ProfilesContext";

/**
 * renderProfile — find profile by id param and render.
 * If not found, show a friendly message and link back.
 */

export default function ViewProfile() {
  const { id } = useParams();
  const { profiles } = useProfiles();
  const profile = profiles.find((p) => p.id === id || p.id === Number(id));

  if (!profile) {
    return (
      <div>
        <p>Profile not found</p>
        <Link to="profiles">Back to list</Link>
      </div>
    );
  }
  return (
    <div>
      <h2>{profile.name}</h2>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      {profile.bio && (
        <p>
          <strong>Bio: </strong>
          {profile.bio}
        </p>
      )}
      <Link to="/profiles">Back to Profiles list</Link>
    </div>
  );
}
