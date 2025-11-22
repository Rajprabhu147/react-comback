import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Button from "../Shared/Button";
import "../../styles/page-layout.css";

const PageLayout = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  showSidebar = false,
  headerAction,
}) => {
  const navigate = useNavigate();

  return (
    <div className="app">
      <Header />
      <div className="app-container">
        {showSidebar && <Sidebar />}
        <main className="main-content">
          <div className="page-header">
            <div className="page-header-content">
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
              <div>
                <h1 className="page-title">{title}</h1>
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
              </div>
            </div>
            {headerAction && (
              <div className="page-header-actions">{headerAction}</div>
            )}
          </div>
          <div className="page-content">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
