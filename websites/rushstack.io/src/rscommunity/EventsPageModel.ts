import { IApiEvent } from "./ApiInterfaces";
import { SessionModel } from "./SessionModel";

export class EventModel {
  public apiEvent: IApiEvent;
  private _eventsPageModel: EventsPageModel;

  public constructor(apiEvent: IApiEvent, parent: EventsPageModel) {
    this.apiEvent = apiEvent;
    this._eventsPageModel = parent;
  }

  public onReserveSpot = (): void => {
    this._eventsPageModel.startAsync(() =>
      this._eventsPageModel.postEventReservation(this)
    );
  };
}

export class EventsPageModel {
  public sessionModel: SessionModel;
  private _forceUpdate: () => void;

  public eventModels: EventModel[] = [];
  public fetchError: Error | undefined = undefined;

  public constructor(forceUpdate: () => void) {
    this._forceUpdate = forceUpdate;
    this.sessionModel = new SessionModel();
  }

  public refresh(): void {
    this.fetchError = undefined;
    this._forceUpdate();

    if (this.sessionModel.loggedInUser) {
      this.fetchEvents().catch((error) => {
        this.fetchError = new Error("Request failed: " + error.message);
        this._forceUpdate();
      });
    }
  }

  public startAsync(action: () => Promise<void>): void {
    action().catch((error) => {
      this.fetchError = new Error("Uncaught exception: " + error.message);
      this._forceUpdate();
    });
  }

  public async fetchEvents(): Promise<void> {
    try {
      console.log("Fetching events...");
      const data: Response = await fetch(
        this.sessionModel.serviceUrl + "/api/events",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!data.ok) {
        throw new Error("Server Error: " + data.statusText);
      }

      const apiEvents: IApiEvent[] = await data.json();
      this.eventModels = apiEvents.map((x) => new EventModel(x, this));
    } finally {
      this._forceUpdate();
    }
  }

  public async postEventReservation(eventModel: EventModel): Promise<void> {
    try {
      console.log("Posting reservation...");
      const data: Response = await fetch(
        this.sessionModel.serviceUrl +
          "/api/event-reservation/" +
          eventModel.apiEvent.dbEventId,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!data.ok) {
        throw new Error("Server Error: " + data.statusText);
      }
    } finally {
      this._forceUpdate();
    }

    await this.fetchEvents();
  }
}
