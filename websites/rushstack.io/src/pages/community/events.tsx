import React from "react";

import { CommunitySidebarLayout } from "../../rscommunity/view/CommunitySidebarLayout";
import { CommunitySignInPage } from "../../rscommunity/view/CommunitySignInPage";
import { AppSession } from "../../rscommunity/model/AppSession";
import { EventCard } from "../../rscommunity/view/EventCard";

class EventsPage extends React.Component {
  private _appSession: AppSession;
  public constructor(props: {}) {
    super(props);
    this._appSession = AppSession.instance;
  }

  public componentDidMount(): void {
    this._appSession.apiDataService.subscribe(this);
    this._appSession.apiDataService.startAsync(() =>
      this._appSession.apiDataService.fetchAllEvents()
    );
  }
  public componentWillUnmount(): void {
    this._appSession.apiDataService.unsubscribe(this);
  }

  public render(): JSX.Element {
    if (!this._appSession.loggedInUser) {
      return <CommunitySignInPage appSession={this._appSession} />;
    }

    if (this._appSession.apiDataService.fetchError) {
      return (
        <div>ERROR: {this._appSession.apiDataService.fetchError.message}</div>
      );
    }

    return (
      <CommunitySidebarLayout
        appSession={this._appSession}
        navItem="events"
        style={{ paddingTop: "100px" }}
      >
        <h2>Upcoming Events</h2>
        <div style={{ maxWidth: "800px" }}>
          {this._appSession.apiDataService.eventModels.map((eventModel) => (
            <EventCard
              cardType="summary"
              eventModel={eventModel}
              key={eventModel.apiEvent.dbEventId}
            />
          ))}
        </div>
      </CommunitySidebarLayout>
    );
  }
}

export default EventsPage;
