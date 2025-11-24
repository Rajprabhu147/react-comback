import React, { useState } from "react";
import "../../styles/tooltip.css";

const Tooltip = ({ children, text, position = "top" }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={`tooltip tooltip-${position} fade-in`}>{text}</div>
      )}
    </div>
  );
};

export default Tooltip;
