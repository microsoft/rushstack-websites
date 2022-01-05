import React from "react";

import { CommunitySidebarLayout } from "../../rscommunity/view/CommunitySidebarLayout";
import { CommunitySignInPage } from "../../rscommunity/view/CommunitySignInPage";
import { AppSession } from "../../rscommunity/api/AppSession";
import { EventCard } from "../../rscommunity/view/EventCard";
import { ObjectEvent } from "../../rscommunity/library/ObjectEvent";
import { ApiTask, ApiTaskStatus } from "../../rscommunity/api/ApiTask";
import { EventModel } from "../../rscommunity/api/models";

class PastEventsPage extends React.Component {
  private readonly _appSession: AppSession;

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

    const eventTask: ApiTask<EventModel[]> =
      this._appSession.apiDataService.initiateGetEvents(this, "past");

    if (eventTask.status === ApiTaskStatus.Error) {
      return <div>ERROR: {eventTask.error.message}</div>;
    }
    if (eventTask.status === ApiTaskStatus.Pending) {
      return <></>;
    }
    const eventModels: EventModel[] = eventTask.result;

    let content: JSX.Element = <i>No events found.</i>;
    if (eventModels.length > 0) {
      content = (
        <>
          {eventModels.map((eventModel) => (
            <EventCard
              cardType="summary"
              eventModel={eventModel}
              apiDataService={this._appSession.apiDataService}
              key={eventModel.apiEvent.dbEventId}
            />
          ))}
        </>
      );
    }

    return (
      <CommunitySidebarLayout
        appSession={this._appSession}
        navItem="past-events"
        style={{ paddingTop: "100px" }}
      >
        <h1>Past Events</h1>
        <div style={{ maxWidth: "800px" }}>{content}</div>
      </CommunitySidebarLayout>
    );
  }
}

export default PastEventsPage;
