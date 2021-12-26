import React from "react";
import dayjs from "dayjs";
import dayjsUtc from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";
import dayjsAdvancedFormat from "dayjs/plugin/advancedFormat";

import { SessionModel } from "../../rscommunity/SessionModel";
import { CommunitySidebarLayout } from "../../rscommunity/CommunitySidebarLayout";
import { CommunitySignInPage } from "../../rscommunity/CommunitySignInPage";
import { DecoratedButton } from "../../rscommunity/DecoratedButton";
import { IApiEvent } from "../../rscommunity/ApiInterfaces";
import { EventModel, EventsPageModel } from "../../rscommunity/EventsPageModel";

dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);
dayjs.extend(dayjsAdvancedFormat);

function calculateEndTime(eventJson: IApiEvent): Date | undefined {
  if (eventJson.startTime === undefined || eventJson.duration === undefined) {
    return undefined;
  }
  if (eventJson.durationUnits !== "minutes") {
    return undefined;
  }

  return dayjs(eventJson.startTime).add(eventJson.duration, "minute").toDate();
}

function EventCard(props: { eventModel: EventModel }): JSX.Element {
  const apiEvent: IApiEvent = props.eventModel.apiEvent;
  const endTime: Date | undefined = calculateEndTime(apiEvent);

  const formattedStartDate: string = apiEvent.startTime
    ? dayjs(apiEvent.startTime).format("dddd MMM D, YYYY")
    : "(event date is unspecified)";

  let formattedTime: string = "";
  if (apiEvent.startTime) {
    formattedTime += dayjs(apiEvent.startTime).format("h:mma");
    if (endTime) {
      formattedTime += "-" + dayjs(endTime).format("h:mma");
    }
  }

  const timeZoneLine: string = apiEvent.startTime
    ? dayjs(apiEvent.startTime).format("zzz ([UTC]Z)")
    : "";

  let hostedByDiv: JSX.Element | undefined = undefined;
  if (apiEvent.hostedBy) {
    let innerContent: JSX.Element;
    if (apiEvent.hostedByUrl) {
      innerContent = (
        <a href={apiEvent.hostedByUrl} target="_blank">
          {apiEvent.hostedBy}
        </a>
      );
    } else {
      innerContent = <>{apiEvent.hostedBy}</>;
    }
    hostedByDiv = (
      <div style={{ paddingTop: "10px" }}>Hosted by: {innerContent}</div>
    );
  }

  let agendaDiv: JSX.Element | undefined = undefined;
  if (apiEvent.agenda.trim() !== "") {
    let agendaParagraphs: string[] = apiEvent.agenda.split(/[\r\n]+/);

    agendaParagraphs[0] = "Agenda: " + agendaParagraphs[0];

    let key: number = 0;
    agendaDiv = (
      <div style={{ paddingTop: "20px" }}>
        {agendaParagraphs.map((x) => (
          <div key={(key++).toString()}>{x}</div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        borderStyle: "solid",
        borderWidth: "3px",
        borderColor: "#c0c0c0",
        marginTop: "20px",
        marginRight: "50px",
        padding: "10px",
        paddingRight: "20px",
      }}
    >
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>
        {apiEvent.eventTitle}
      </div>
      <div
        style={{ display: "flex", flexDirection: "row", paddingTop: "10px" }}
      >
        <div style={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
          {formattedStartDate}
          <br />
          {formattedTime}
        </div>
        <div style={{ flexGrow: 1, textAlign: "right", fontStyle: "italic" }}>
          {timeZoneLine}
        </div>
      </div>

      {hostedByDiv}
      {agendaDiv}
      <div style={{ paddingTop: "20px" }}>
        Spots left: {apiEvent.spotsLeftNotice}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingBottom: "10px",
        }}
      >
        {apiEvent.userIsSignedUp ? (
          <DecoratedButton theme="notice">Edit Reservation</DecoratedButton>
        ) : (
          <DecoratedButton onClick={props.eventModel.onReserveSpot}>
            Reserve a spot - I will attend
          </DecoratedButton>
        )}
      </div>
    </div>
  );
}

class EventsPage extends React.Component {
  private _eventsPageModel: EventsPageModel;

  public constructor(props: {}) {
    super(props);
    this._eventsPageModel = new EventsPageModel(this.forceUpdate.bind(this));
  }

  public get sessionModel(): SessionModel {
    return this._eventsPageModel.sessionModel;
  }

  public componentDidMount(): void {
    this._eventsPageModel.refresh();
  }

  public render(): JSX.Element {
    if (!this.sessionModel.loggedInUser) {
      return <CommunitySignInPage sessionModel={this.sessionModel} />;
    }

    if (this._eventsPageModel.fetchError) {
      return <div>ERROR: {this._eventsPageModel.fetchError.message}</div>;
    }

    return (
      <CommunitySidebarLayout
        context={this.sessionModel}
        currentPage="events"
        style={{ paddingTop: "100px" }}
      >
        <h2>Upcoming Events</h2>
        <div style={{ maxWidth: "800px" }}>
          {this._eventsPageModel.eventModels.map((eventModel) => (
            <EventCard
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
