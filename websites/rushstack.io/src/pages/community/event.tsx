import React from "react";

import { CommunitySidebarLayout } from "../../rscommunity/view/CommunitySidebarLayout";
import { CommunitySignInPage } from "../../rscommunity/view/CommunitySignInPage";
import { AppSession } from "../../rscommunity/model/AppSession";
import { EventCard } from "../../rscommunity/view/EventCard";
import {
  EventModel,
  ApiTask,
  ApiTaskStatus,
} from "../../rscommunity/model/ApiDataService";

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
      this.forceUpdate();
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

    const apiTask: ApiTask<EventModel> =
      this._appSession.apiDataService.initiateGetEvent(this, this._eventId);

    if (apiTask.status === ApiTaskStatus.Error) {
      return <div>ERROR: {apiTask.error.message}</div>;
    }
    if (apiTask.status === ApiTaskStatus.Pending) {
      return <></>;
    }
    const eventModel: EventModel = apiTask.result;

    console.log(
      "GOT:" + eventModel ? JSON.stringify(eventModel?.apiEvent) : "undefined"
    );

    let breadcrumb: JSX.Element = (
      <div>
        &lt;&lt;{" "}
        {eventModel.apiEvent.isCompleted ? (
          <a href={"/community/past-events"}>Past Events</a>
        ) : (
          <a href={"/community/events"}>Upcoming Events</a>
        )}
      </div>
    );

    return (
      <CommunitySidebarLayout
        appSession={this._appSession}
        navItem={eventModel.apiEvent.isCompleted ? "past-events" : "events"}
        style={{ paddingTop: "100px" }}
      >
        {breadcrumb}

        <div style={{ maxWidth: "800px", paddingBottom: "20px" }}>
          {eventModel ? (
            <EventCard
              cardType="detail"
              eventModel={eventModel}
              key={eventModel.apiEvent.dbEventId}
            />
          ) : undefined}
        </div>

        {breadcrumb}
      </CommunitySidebarLayout>
    );
  }
}

export default EventPage;
