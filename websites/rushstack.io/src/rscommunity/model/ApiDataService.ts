import { IApiEvent } from "../ApiInterfaces";
import { AppSession } from "./AppSession";

export class EventModel {
  public readonly apiEvent: IApiEvent;
  public readonly appSession: AppSession;

  public constructor(apiEvent: IApiEvent, appSession: AppSession) {
    this.apiEvent = apiEvent;
    this.appSession = appSession;
  }

  public onNavigateToEventDetailPage = (): void => {
    this.appSession.navigateToEventDetailPage(this.apiEvent.dbEventId);
  };

  public onAddReservation = (): void => {
    this.appSession.apiDataService.startAsync(() =>
      this.appSession.apiDataService.addReservation(this)
    );
  };

  public onRemoveReservation = (): void => {
    this.appSession.apiDataService.startAsync(() =>
      this.appSession.apiDataService.removeReservation(this)
    );
  };
}

export class ApiDataService {
  private _subscribedComponents: Set<React.Component> = new Set();

  public readonly appSession: AppSession;

  private _eventModelById: Map<number, EventModel> = new Map();
  public eventModels: EventModel[] = [];
  public fetchError: Error | undefined = undefined;

  public constructor(appSession: AppSession) {
    this.appSession = appSession;
  }

  public subscribe(component: React.Component): void {
    this._subscribedComponents.add(component);
  }

  public unsubscribe(component: React.Component): void {
    this._subscribedComponents.add(component);
  }

  private _forceUpdate(): void {
    for (const component of Array.from(this._subscribedComponents)) {
      try {
        component.forceUpdate();
      } catch (error) {
        console.error("forceUpdate() failed: " + (error as Error).toString());
      }
    }
  }

  private _requireLoggedIn(): void {
    if (!this.appSession.loggedInUser) {
      throw new Error("Not signed in");
    }
  }

  public startAsync(action: () => Promise<void>): void {
    action()
      .catch((error) => {
        this.fetchError = new Error("Uncaught exception: " + error.message);
      })
      .finally(() => {
        this._forceUpdate();
      });
  }

  public getEvent(eventId: number): EventModel | undefined {
    return this._eventModelById.get(eventId);
  }

  public async fetchAllEvents(): Promise<void> {
    try {
      this._requireLoggedIn();
      console.log("Fetching events...");
      const data: Response = await fetch(
        this.appSession.serviceUrl + "/api/events",
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
      this.eventModels = apiEvents.map(
        (x) => new EventModel(x, this.appSession)
      );
    } finally {
      this._forceUpdate();
    }
  }

  public async fetchEvent(dbEventId: number): Promise<void> {
    try {
      this._requireLoggedIn();

      this._eventModelById.delete(dbEventId);

      console.log("Fetching event...");
      const data: Response = await fetch(
        `${this.appSession.serviceUrl}/api/event/${dbEventId.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!data.ok) {
        throw new Error("Server Error: " + data.statusText);
      }

      const apiEvent: IApiEvent = await data.json();
      this._eventModelById.set(
        dbEventId,
        new EventModel(apiEvent, this.appSession)
      );
    } finally {
      this._forceUpdate();
    }
  }

  public async addReservation(eventModel: EventModel): Promise<void> {
    try {
      this._requireLoggedIn();

      console.log("Posting reservation...");
      const data: Response = await fetch(
        `${this.appSession.serviceUrl}/api/event-reservation/${eventModel.apiEvent.dbEventId}`,
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

    await this.fetchAllEvents();
  }

  public async removeReservation(eventModel: EventModel): Promise<void> {
    try {
      this._requireLoggedIn();

      console.log("Deleting reservation...");
      const data: Response = await fetch(
        `${this.appSession.serviceUrl}/api/event-reservation/${eventModel.apiEvent.dbEventId}`,
        {
          method: "DELETE",
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

    await this.fetchAllEvents();
  }
}
