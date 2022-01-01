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
import { ObjectEvent } from "../../rscommunity/library/ObjectEvent";

class EventsPage extends React.Component {
  private _appSession: AppSession;
  public constructor(props: {}) {
    super(props);
    this._appSession = AppSession.instance;
  }

  public componentDidMount(): void {
    this._appSession.apiDataService.updated.subscribe(this, () =>
      this.forceUpdate()
    );
  }
  public componentWillUnmount(): void {
    ObjectEvent.disposeSubscriptionsInvolving(this);
  }

  public render(): JSX.Element {
    if (!this._appSession.loggedInUser) {
      return <CommunitySignInPage appSession={this._appSession} />;
    }

    const apiTask: ApiTask<EventModel[]> =
      this._appSession.apiDataService.initiateGetEvents(this, "current");

    if (apiTask.status === ApiTaskStatus.Error) {
      return <div>ERROR: {apiTask.error.message}</div>;
    }
    if (apiTask.status === ApiTaskStatus.Pending) {
      return <></>;
    }
    const eventModels: EventModel[] = apiTask.result;

    return (
      <CommunitySidebarLayout
        appSession={this._appSession}
        navItem="events"
        style={{ paddingTop: "100px" }}
      >
        <h1>Upcoming Events</h1>
        <div style={{ maxWidth: "800px" }}>
          {eventModels.map((eventModel) => (
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
