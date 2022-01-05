import React from "react";

import { CommunitySidebarLayout } from "../../rscommunity/view/CommunitySidebarLayout";
import { CommunitySignInPage } from "../../rscommunity/view/CommunitySignInPage";
import { AppSession } from "../../rscommunity/api/AppSession";
import { EventCard } from "../../rscommunity/view/EventCard";
import { ObjectEvent } from "../../rscommunity/library/ObjectEvent";
import { ApiTask, ApiTaskStatus } from "../../rscommunity/api/ApiTask";
import { EventModel } from "../../rscommunity/api/models";

class EventPage extends React.Component {
  private readonly _appSession: AppSession;
  private _eventId: number | undefined;

  public constructor(props: {}) {
    super(props);
    this._appSession = AppSession.instance;
  }

  public componentDidMount(): void {
    this._appSession.apiDataService.updated.subscribe(this, () =>
      this.forceUpdate()
    );

    this._eventId = undefined;
    const queryParams: URLSearchParams = new URLSearchParams(
      window.location.search
    );
    const eventId: number = parseInt(queryParams.get("id") ?? "");
    if (!isNaN(eventId)) {
      this._eventId = eventId;
      this.forceUpdate();
    }
  }

  public componentWillUnmount(): void {
    ObjectEvent.disposeSubscriptionsInvolving(this);
  }

  public render(): JSX.Element {
    if (!this._appSession.loggedInUser) {
      return <CommunitySignInPage appSession={this._appSession} />;
    }

    if (this._eventId === undefined) {
      return <div>ERROR: Missing event id</div>;
    }

    const eventTask: ApiTask<EventModel> =
      this._appSession.apiDataService.initiateGetEvent(this, this._eventId);

    if (eventTask.status === ApiTaskStatus.Error) {
      return <div>ERROR: {eventTask.error.message}</div>;
    }

    if (eventTask.status === ApiTaskStatus.Pending) {
      return <></>;
    }
    const eventModel: EventModel = eventTask.result;

    let breadcrumb: JSX.Element = (
      <div>
        &lt;&lt;&nbsp;
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
              apiDataService={this._appSession.apiDataService}
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
