import React from "react";
import { SessionModel } from "../../rscommunity/SessionModel";
import { CommunitySidebarLayout } from "../../rscommunity/CommunitySidebarLayout";
import { CommunitySignInPage } from "../../rscommunity/CommunitySignInPage";

function ProfilePage(): JSX.Element {
  const context: SessionModel = new SessionModel();
  if (!context.loggedInUser) {
    return <CommunitySignInPage sessionModel={context} />;
  }

  return (
    <CommunitySidebarLayout context={context} currentPage="profile">
      <div>You are logged in as {context.loggedInUser}</div>
    </CommunitySidebarLayout>
  );
}

export default ProfilePage;
