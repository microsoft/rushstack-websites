import dayjs from "dayjs";
import dayjsUtc from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";
import dayjsAdvancedFormat from "dayjs/plugin/advancedFormat";

import React from "react";
import { CommunityContext } from "../../rscommunity/CommunityContext";
import { CommunitySidebarLayout } from "../../rscommunity/CommunitySidebarLayout";
import { CommunitySignInPage } from "../../rscommunity/CommunitySignInPage";
import { DecoratedButton } from "../../rscommunity/DecoratedButton";

dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);
dayjs.extend(dayjsAdvancedFormat);

interface ICurrentEventJson {
  eventId: number;
  eventTitle: string;
  startTime: Date;
  endTime: Date;
  hostedBy: string;
  hostedByUrl: string;
  agenda: string;
  spotsLeftNotice: string;
  userIsSignedUp: boolean;
}
const eventsJson: ICurrentEventJson[] = [
  {
    eventId: 1001,
    eventTitle: "Rush Hour January (monthly meet up)",
    startTime: new Date("2021-12-22 11:30"),
    endTime: new Date("2021-12-22 12:00"),
    hostedBy: "Pete Gonzalez",
    hostedByUrl: "https://github.com/octogonz/",
    agenda:
      "Meet other people from the Rush community, get answers from the maintainers." +
      " This month we'll be discussing:\n - the build cache\n - plugins\n - Bazel integration",
    spotsLeftNotice: ">5",
    userIsSignedUp: false,
  },
  {
    eventId: 1002,
    eventTitle: "Rush Hour February (monthly meet up)",
    startTime: new Date("2021-12-22 11:30"),
    endTime: new Date("2021-12-22 12:00"),
    hostedBy: "Pete Gonzalez",
    hostedByUrl: "https://github.com/octogonz/",
    agenda:
      "Meet other people from the Rush community, get answers from the maintainers." +
      " This month we'll be discussing the build cache, plugins, and Bazel integration",
    spotsLeftNotice: ">5",
    userIsSignedUp: true,
  },
  {
    eventId: 1003,
    eventTitle: "Rush Hour March (monthly meet up)",
    startTime: new Date("2021-12-22 11:30"),
    endTime: new Date("2021-12-22 12:00"),
    hostedBy: "Pete Gonzalez",
    hostedByUrl: "https://github.com/octogonz/",
    agenda: "",
    spotsLeftNotice: ">5",
    userIsSignedUp: false,
  },
];

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

function EventCard(props: { eventJson: ICurrentEventJson }): JSX.Element {
  const eventJson: ICurrentEventJson = props.eventJson;

  const startTime: string = dayjs(eventJson.startTime).format(
    "dddd MMM D, YYYY h:mma"
  );
  const endTime: string = dayjs(eventJson.endTime).format("h:mma");
  const timeZoneLine: string = dayjs(eventJson.startTime).format(
    "zzz ([UTC]Z)"
  );

  let agendaDiv: JSX.Element;
  if (eventJson.agenda.trim() === "") {
    agendaDiv = <></>;
  } else {
    let agendaParagraphs: string[] = eventJson.agenda.split(/[\r\n]+/);

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
      }}
    >
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>
        {eventJson.eventTitle}
      </div>
      <div style={{ fontWeight: "bold" }}>
        {startTime}-{endTime}
      </div>
      <div>{timeZoneLine}</div>
      <div>Hosted by: {eventJson.hostedBy}</div>
      {agendaDiv}
      <div style={{ paddingTop: "20px" }}>
        Spots left: {eventJson.spotsLeftNotice}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "20px",
          paddingBottom: "10px",
        }}
      >
        {eventJson.userIsSignedUp ? (
          <DecoratedButton>Reserve a spot - I will attend</DecoratedButton>
        ) : (
          <DecoratedButton theme="notice">Edit Reservation</DecoratedButton>
        )}
      </div>
    </div>
  );
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
    <CommunitySidebarLayout
      context={context}
      currentPage="events"
      style={{ paddingTop: "100px" }}
    >
      <h2>Upcoming Events</h2>
      {eventsJson.map((eventJson) => (
        <EventCard eventJson={eventJson} key={eventJson.eventId} />
      ))}
    </CommunitySidebarLayout>
  );
}

export default EventsPage;
