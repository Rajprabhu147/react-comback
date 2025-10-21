import React from "react";
import { useParams, Link } from "react-router-dom";

export default function ViewProfile({ profiles }) {
  const { id } = useParams();
  const profile = profiles.find((p) => p.id === Number(id));

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
      <Link to="/profiles">Back to list</Link>
    </div>
  );
}
