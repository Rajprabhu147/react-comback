import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  loading,
  disabled,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const baseClass = "btn";
  const variantClass = `btn-${variant}`;
  const sizeClass = size === "sm" ? "btn-sm" : "";
  const iconClass = icon && !children ? "btn-icon" : "";

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass} ${iconClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="spinner" style={{ width: 16, height: 16 }} />
      )}
      {icon && !loading && icon}
      {children}
    </button>
  );
};

export default Button;
