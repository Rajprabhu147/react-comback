// src/components/TripPlanner/MapSection.jsx

import React from "react";
import ItineraryMap from "../Calendar/ItineraryMap";

const MapSection = ({ activities }) => {
  return (
    <div className="planner-map-section">
      <ItineraryMap activities={activities} />
    </div>
  );
};

export default MapSection;
