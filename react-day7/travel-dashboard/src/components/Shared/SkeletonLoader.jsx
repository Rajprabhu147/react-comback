import React from "react";

const SkeletonLoader = ({ type = "item", count = 3 }) => {
  if (type === "item") {
    return (
      <div className="skeleton-container">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-item">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text short"></div>
            <div className="skeleton-badges">
              <div className="skeleton skeleton-badge"></div>
              <div className="skeleton skeleton-badge"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className="skeleton-chart">
        <div className="skeleton skeleton-chart-title"></div>
        <div className="skeleton skeleton-chart-body"></div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
