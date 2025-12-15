import React from "react";
import PageLayout from "../components/Layout/PageLayout";
import ProfileDashboard from "../components/Profile/ProfileDashboard";

const Profile = () => {
  return (
    <PageLayout
      title="My Profile"
      subtitle="View your travel history and expenses"
      showBackButton={true}
    >
      <ProfileDashboard />
    </PageLayout>
  );
};

export default Profile;
