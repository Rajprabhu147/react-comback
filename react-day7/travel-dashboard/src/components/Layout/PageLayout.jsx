import React from "react";
// useNavigate allows navigating programmatically (like going back)
import { useNavigate } from "react-router-dom";
// Global app header (top navigation bar)
import Header from "./Header";
// Optional sidebar navigation
import Sidebar from "./Sidebar";
// Reusable styled button component
import Button from "../Shared/Button";
// Styles specific to this layout structure
import "../../styles/page-layout.css";

/**
 * PageLayout Component
 * ----------------------
 * A reusable layout wrapper u sed by most pages across the dashboard.
 * It provides:
 * - App header at the top
 * - Optional sidebar
 * - Page title + subtitle
 * - Optional "Back" button
 * - Optional header action (like "Save", "Reset", etc.)
 * - Structured content area for page content
 */
const PageLayout = ({
  children, // content of the page being displayed inside the layout
  title, // main page title text
  subtitle, // optional subtitle text
  showBackButton = false, // controls visibility of "Back" button
  showSidebar = false, // controls whether sidebar appears
  headerAction, // optional action button displayed on the right side of header
}) => {
  const navigate = useNavigate(); // used to navigate the user back

  return (
    <div className="app">
      {/* Always show global header (top bar navigation) */}
      <Header />

      <div className="app-container">
        {/* Conditionally render sidebar if showSidebar=true (used on pages that require navigation links) */}
        {showSidebar && <Sidebar />}

        {/* Main section where page content sits */}
        <main className="main-content">
          {/* Page header containing title, back button, and optional actions */}
          <div className="page-header">
            {/* Left side: back button + title/subtitle */}
            <div className="page-header-content">
              {/* Title + optional subtitle */}
              <div>
                <h1 className="page-title">{title}</h1>
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
                {/* Optional "Back" button — navigates user to previous page */}
                {showBackButton && (
                  <Button
                    id="back-button"
                    variant="secondary"
                    size="sm"
                    icon={<span>←</span>} // arrow icon
                    onClick={() => navigate(-1)} // go back in history
                    className="back-button"
                  >
                    Back
                  </Button>
                )}
              </div>
            </div>

            {/* Right side: custom header actions (e.g., Save, Reset, Create) */}
            {headerAction && (
              <div className="page-header-actions">{headerAction}</div>
            )}
          </div>

          {/* Main scrollable content area where the actual page content is displayed */}
          <div className="page-content">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
