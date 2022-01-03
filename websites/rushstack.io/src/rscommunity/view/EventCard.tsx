import React from "react";
import dayjs from "dayjs";
import "../dayjsExtensions";

import styles from "./EventCard.module.css";

import { EventModel } from "../api/ApiDataService";
import { DecoratedButton } from "../view/DecoratedButton";
import { IApiEvent } from "../api/ApiInterfaces";

function calculateEndTime(eventJson: IApiEvent): Date | undefined {
  if (eventJson.startTime === undefined || eventJson.duration === undefined) {
    return undefined;
  }
  if (eventJson.durationUnits !== "minutes") {
    return undefined;
  }

  return dayjs(eventJson.startTime).add(eventJson.duration, "minute").toDate();
}

export function EventCardBody(props: { eventModel: EventModel }): JSX.Element {
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
  if (apiEvent.agendaHtml.trim() !== "") {
    agendaDiv = (
      <div
        style={{ paddingTop: "20px" }}
        // The server scrubs this text to ensure it is safe HTML
        dangerouslySetInnerHTML={{
          __html: apiEvent.agendaHtml.replace(/^\<p\>/, "<p>Agenda: "),
        }}
      />
    );
  }

  return (
    <>
      <h2>{apiEvent.eventTitle}</h2>
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
    </>
  );
}

export function EventCard(props: {
  eventModel: EventModel;
  cardType: "summary" | "detail";
}): JSX.Element {
  const apiEvent: IApiEvent = props.eventModel.apiEvent;

  let footnote: JSX.Element | undefined;
  let actionButton: JSX.Element | undefined;
  let spotsLeftDiv: JSX.Element | undefined;

  if (!apiEvent.isCompleted) {
    // UPCOMING EVENT
    if (apiEvent.userIsSignedUp) {
      footnote = <>You are attending this event</>;

      if (props.cardType === "summary") {
        actionButton = (
          <DecoratedButton
            theme="notice"
            onClick={props.eventModel.onNavigateToEventDetailPage}
          >
            Edit Reservation
          </DecoratedButton>
        );
      } else {
        actionButton = (
          <DecoratedButton
            theme="notice"
            onClick={props.eventModel.onRemoveReservation}
          >
            Cancel your reservation
          </DecoratedButton>
        );
      }
    } else {
      actionButton = (
        <DecoratedButton onClick={props.eventModel.onAddReservation}>
          Reserve a spot - I will attend
        </DecoratedButton>
      );
      spotsLeftDiv = (
        <div style={{ paddingTop: "20px" }}>
          Spots left: {apiEvent.spotsLeftNotice}
        </div>
      );
    }
  } else {
    // PAST EVENT
    if (apiEvent.userIsSignedUp) {
      footnote = <>You signed up for this event</>;
    }
    if (props.cardType === "summary") {
      actionButton = (
        <DecoratedButton
          theme="default"
          onClick={props.eventModel.onNavigateToEventDetailPage}
        >
          {apiEvent.notesHtml ? "Meeting Notes" : "Details"}
        </DecoratedButton>
      );
    }
  }

  let detailBox: JSX.Element | undefined;

  if (props.cardType === "detail") {
    if (!apiEvent.isCompleted) {
      // UPCOMING EVENT
      if (apiEvent.userIsSignedUp) {
        detailBox = (
          <div className={styles.detailBox}>
            <h2>Join the video call</h2>
            <div style={{ paddingTop: "20px" }}>
              On the day of this event, the MS Teams URL will be sent to your
              member email address.
            </div>
          </div>
        );
      }
    } else {
      // PAST EVENT
      if (apiEvent.notesHtml) {
        detailBox = (
          <div className={styles.detailBox}>
            <h2>Meeting Notes</h2>
            <div
              style={{ paddingTop: "20px" }}
              // The server scrubs this text to ensure it is safe HTML
              dangerouslySetInnerHTML={{
                __html: apiEvent.notesHtml,
              }}
            />
          </div>
        );
      } else {
        detailBox = (
          <div className={styles.detailBox}>
            <h2>Meeting Notes</h2>
            <div style={{ paddingTop: "20px" }}>
              <i>No notes were posted for this meeting.</i>
            </div>
          </div>
        );
      }
    }
  }

  return (
    <>
      <div className={styles.eventCardBorder}>
        <EventCardBody eventModel={props.eventModel} />
        {spotsLeftDiv}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingBottom: "10px",
          }}
        >
          <div
            style={{
              flexGrow: 1,
              alignSelf: "flex-end",
              fontWeight: "bold",
              color: "#c95228",
            }}
          >
            {footnote}
          </div>

          {actionButton}
        </div>
      </div>
      {detailBox}
    </>
  );
}
