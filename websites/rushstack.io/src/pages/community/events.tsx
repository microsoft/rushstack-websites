import React from "react";
import dayjs from "dayjs";
import dayjsUtc from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";
import dayjsAdvancedFormat from "dayjs/plugin/advancedFormat";

import { CommunityContext } from "../../rscommunity/CommunityContext";
import { CommunitySidebarLayout } from "../../rscommunity/CommunitySidebarLayout";
import { CommunitySignInPage } from "../../rscommunity/CommunitySignInPage";
import { DecoratedButton } from "../../rscommunity/DecoratedButton";
import { IApiEvent } from "../../rscommunity/ApiInterfaces";

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

function EventCard(props: { apiEvent: IApiEvent }): JSX.Element {
  const apiEvent: IApiEvent = props.apiEvent;
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
          <DecoratedButton>Reserve a spot - I will attend</DecoratedButton>
        )}
      </div>
    </div>
  );
}

class EventsPage extends React.Component {
  private _context!: CommunityContext;
  private _apiEvents: IApiEvent[] | undefined = undefined;
  private _fetchError: Error | undefined = undefined;

  public constructor(props: {}) {
    super(props);
    this._context = new CommunityContext();
  }

  public componentDidMount(): void {
    if (this._context.loggedInUser) {
      this._fetchData().catch((error) => {
        this._fetchError = new Error("Request failed: " + error.message);
        this.forceUpdate();
      });
    }
  }

  private async _fetchData(): Promise<void> {
    console.log("Fetching events...");
    const data: Response = await fetch(
      this._context.serviceUrl + "/api/events",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (!data.ok) {
      throw new Error("Server Error: " + data.statusText);
    }

    this._apiEvents = await data.json();
    this.forceUpdate();
  }

  public render(): JSX.Element {
    if (!this._context.loggedInUser) {
      return <CommunitySignInPage context={this._context} />;
    }

    if (this._fetchError) {
      return <div>ERROR: {this._fetchError.message}</div>;
    }

    if (!this._apiEvents) {
      return (
        <CommunitySidebarLayout
          context={this._context}
          currentPage="events"
          style={{ paddingTop: "100px" }}
        >
          <h2>Upcoming Events</h2>
          <div style={{ maxWidth: "800px" }}>. . .</div>
        </CommunitySidebarLayout>
      );
    }

    return (
      <CommunitySidebarLayout
        context={this._context}
        currentPage="events"
        style={{ paddingTop: "100px" }}
      >
        <h2>Upcoming Events</h2>
        <div style={{ maxWidth: "800px" }}>
          {this._apiEvents.map((eventJson) => (
            <EventCard apiEvent={eventJson} key={eventJson.dbEventId} />
          ))}
        </div>
      </CommunitySidebarLayout>
    );
  }
}

export default EventsPage;
