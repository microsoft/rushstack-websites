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
    console.log("EventPage render");
    if (!this._appSession.loggedInUser) {
      return <CommunitySignInPage appSession={this._appSession} />;
    }

    if (this._eventId === undefined) {
      return <div>ERROR: Missing event id</div>;
    }

    if (this._appSession.apiDataService.fetchError) {
      return (
        <div>ERROR: {this._appSession.apiDataService.fetchError.message}</div>
      );
    }

    const eventModel: EventModel | undefined =
      this._appSession.apiDataService.getEvent(this._eventId);

    console.log(
      "GOT:" + eventModel ? JSON.stringify(eventModel?.apiEvent) : "undefined"
    );

    return (
      <CommunitySidebarLayout
        appSession={this._appSession}
        navItem="events"
        style={{ paddingTop: "100px" }}
      >
        <div>
          &lt;&lt; <a href={"/community/events"}>Upcoming Events</a>
        </div>

        <div style={{ maxWidth: "800px" }}>
          {eventModel ? (
            <EventCard
              cardType="detail"
              eventModel={eventModel}
              key={eventModel.apiEvent.dbEventId}
            />
          ) : undefined}
        </div>

        <div style={{ paddingTop: "20px" }}>
          &lt;&lt; <a href={"/community/events"}>Upcoming Events</a>
        </div>
      </CommunitySidebarLayout>
    );
  }
}

export default EventPage;
