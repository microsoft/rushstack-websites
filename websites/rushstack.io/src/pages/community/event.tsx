import React from "react";

import { CommunitySidebarLayout } from "../../rscommunity/view/CommunitySidebarLayout";
import { CommunitySignInPage } from "../../rscommunity/view/CommunitySignInPage";
import { AppSession } from "../../rscommunity/model/AppSession";
import { EventCard } from "../../rscommunity/view/EventCard";
import { EventModel } from "../../rscommunity/model/ApiDataService";

class EventPage extends React.Component {
  private _appSession: AppSession;
  private _eventId: number | undefined;

  public constructor(props: {}) {
    super(props);
    this._appSession = AppSession.instance;
  }

  public componentDidMount(): void {
    this._appSession.apiDataService.subscribe(this);

    this._eventId = undefined;
    const queryParams: URLSearchParams = new URLSearchParams(
      window.location.search
    );
    const eventId: number = parseInt(queryParams.get("id") ?? "");
    if (isFinite(eventId)) {
      this._eventId = eventId;

      this._appSession.apiDataService.startAsync(() =>
        this._appSession.apiDataService.fetchEvent(eventId)
      );
    }
  }
  public componentWillUnmount(): void {
    this._appSession.apiDataService.unsubscribe(this);
  }

  public render(): JSX.Element {
    if (!this._appSession.loggedInUser) {
      return <CommunitySignInPage appSession={this._appSession} />;
    }

    if (this._eventId === undefined) {
      return <div>ERROR: Missing event id</div>;
    }
    debugger;

    if (this._appSession.apiDataService.fetchError) {
      return (
        <div>ERROR: {this._appSession.apiDataService.fetchError.message}</div>
      );
    }

    const eventModel: EventModel | undefined =
      this._appSession.apiDataService.getEvent(this._eventId);

    return (
      <CommunitySidebarLayout
        appSession={this._appSession}
        navItem="events"
        style={{ paddingTop: "100px" }}
      >
        <h2>Upcoming Events</h2>
        <div style={{ maxWidth: "800px" }}>
          {eventModel ? (
            <EventCard
              eventModel={eventModel}
              key={eventModel.apiEvent.dbEventId}
            />
          ) : undefined}
        </div>
      </CommunitySidebarLayout>
    );
  }
}

export default EventPage;
