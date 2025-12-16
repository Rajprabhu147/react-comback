import React from "react";
import PageLayout from "../components/Layout/PageLayout";
import ProfileDashboard from "../components/Profile/ProfileDashboard";

/**
 * Profile Page
 *
 * Displays user profile dashboard with:
 * - User credentials and basic info
 * - Trip statistics
 * - Recent expenses
 * - Itinerary timeline
 * - Visited places
 *
 * This is READ-ONLY view of user profile
 * For editing profile, see ProfileSettings page
 */
const Profile = () => {
  return (
    <PageLayout
      title="My Profile"
      subtitle="View your travel history, expenses, and visited places"
      showBackButton={true}
    >
      <ProfileDashboard />
    </PageLayout>
  );
};

export default Profile;
