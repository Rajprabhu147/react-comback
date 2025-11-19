import React from "react";

/**
 * Reusable Input Component
 * ---------------------------------------------------------
 * This component standardizes all text input fields across your app.
 * It supports:
 * - Optional label
 * - Error message display
 * - Custom input types (text, email, password, number, etc.)
 * - Additional classes
 * - Any extra input props (placeholder, onChange, value, etc.)
 */

const Input = ({
  label, // Optional label text shown above the input
  error, // Error message; when present input gets 'error' class
  type = "text", // Input type (default is text)
  className = "", // Extra classes from parent component
  ...props // All other input props (value, onChange, placeholder)
}) => {
  return (
    <div className="form-group">
      {/* If label prop is provided, show the label */}
      {label && <label className="form-label">{label}</label>}

      {/* Input field */}
      <input
        type={type}
        className={`form-input ${error ? "error" : ""} ${className}`}
        {...props} // Spread all input attributes (value, onChange, etc.)
      />

      {/* Show error message if error exists */}
      {error && (
        <span
          style={{
            color: "var(--danger)", // Error text color
            fontSize: "12px",
            marginTop: "4px",
            display: "block",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
