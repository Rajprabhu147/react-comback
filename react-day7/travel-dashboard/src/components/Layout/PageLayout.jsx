import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Button from "../Shared/Button";
import "../../styles/page-layout.css";

/**
 * PageLayout Component
 * ----------------------
 * Reusable layout wrapper for dashboard pages
 * - App header at top
 * - Page title + subtitle on left
 * - Back button + header action on right
 */
const PageLayout = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  headerAction,
}) => {
  const navigate = useNavigate();

  return (
    <div className="app">
      <Header />

      <div className="app-container">
        <main className="main-content">
          <div className="page-header">
            {/* Left side: title + subtitle */}
            <div className="page-title-container">
              <h1 className="page-title">{title}</h1>
              {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>

            {/* Right side: back button + header actions */}
            <div className="page-header-actions">
              {showBackButton && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<span>←</span>}
                  onClick={() => navigate(-1)}
                  className="back-button"
                >
                  Back
                </Button>
              )}
              {headerAction && <>{headerAction}</>}
            </div>
          </div>

          <div className="page-content">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
