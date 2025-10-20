import React from "react";

import { useParams } from "react-router-dom";

export default function ViewProfile() {
  const { id } = useParams();
  return (
    <div>
      <h2>View Profile #{id}</h2>
    </div>
  );
}
