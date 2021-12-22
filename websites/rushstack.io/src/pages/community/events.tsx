import React from "react";
import { CommunityContext } from "../../rscommunity/CommunityContext";
import { CommunitySidebarLayout } from "../../rscommunity/CommunitySidebarLayout";
import { CommunitySignInPage } from "../../rscommunity/CommunitySignInPage";

async function testAsync(context: CommunityContext): Promise<void> {
  console.log("Testing a REST request...");
  try {
    const data: Response = await fetch(context.serviceUrl + "/api/profile", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!data.ok) {
      throw new Error("Server Error: " + data.statusText);
    }

    const json: unknown = await data.json();

    console.log("Request successful:");
    console.log(JSON.stringify(json));
  } catch (error) {
    console.error("REST request failed: " + error.toString());
  }
}

function EventsPage(): JSX.Element {
  const context: CommunityContext = new CommunityContext();
  if (!context.loggedInUser) {
    return <CommunitySignInPage context={context} />;
  }

  const testButton_onClick = React.useCallback(() => {
    console.log("Performing test");
    testAsync(context);
  }, [context.serviceUrl]);

  return (
    <CommunitySidebarLayout context={context}>
      <div>You are logged in as {context.loggedInUser}</div>
      <div>
        <button onClick={testButton_onClick}>TEST</button>
      </div>
    </CommunitySidebarLayout>
  );
}

export default EventsPage;
