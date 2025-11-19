import React from "react";

/**
 * Reusable Button Component
 * ---------------------------------------------------------
 * This component allows you to create customizable buttons
 * with support for:
 * - Different styles (variant)
 * - Different sizes (size)
 * - Loading spinners
 * - Icons
 * - Disabled state
 * - Custom className
 * - All native <button> attributes via ...props
 */

const Button = ({
  children, // Button text/content
  variant = "primary", // Button style theme (primary, secondary, danger, etc.)
  size = "md", // Button size (md = normal, sm = small)
  icon, // Optional icon element (like <FiPlus />)
  loading, // Shows spinner when true
  disabled, // Disables button
  onClick, // Click handler
  type = "button", // Type of button (button, submit, reset)
  className = "", // Extra classnames
  ...props // Any other props
}) => {
  // Base button class
  const baseClass = "btn";

  // Variant class (e.g., btn-primary, btn-danger)
  const variantClass = `btn-${variant}`;

  // Apply "btn-sm" only if size is small
  const sizeClass = size === "sm" ? "btn-sm" : "";

  // If icon exists and there's no text, apply special icon-only styling
  const iconClass = icon && !children ? "btn-icon" : "";

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass} ${iconClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading} // Disable when loading too
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <span className="spinner" style={{ width: 16, height: 16 }} />
      )}

      {/* Show icon only when not loading */}
      {icon && !loading && icon}

      {/* Show button label */}
      {children}
    </button>
  );
};

export default Button;
