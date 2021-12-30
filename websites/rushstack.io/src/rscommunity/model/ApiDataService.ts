import React from "react";
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
    this.appSession.apiDataService.addReservationAsync(this).catch((error) => {
      console.error((error as Error).toString());
    });
  };

  public onRemoveReservation = (): void => {
    this.appSession.apiDataService
      .removeReservationAsync(this)
      .catch((error) => {
        console.error((error as Error).toString());
      });
  };
}

export enum ApiTaskStatus {
  Error,
  Pending,
  Success,
}

export interface ApiTaskError {
  status: ApiTaskStatus.Error;
  error: Error;
}
export interface ApiTaskPending {
  status: ApiTaskStatus.Pending;
}
export interface ApiTaskSuccess<TResult> {
  status: ApiTaskStatus.Success;
  result: TResult;
}

export type ApiTask<TItem> =
  | ApiTaskError
  | ApiTaskPending
  | ApiTaskSuccess<TItem>;

interface ICacheEntry {
  key: string;
  timestamp: number;
  task: ApiTask<unknown>;
  components: Set<React.Component>;
}

export class ApiDataService {
  private _subscribedComponents: Set<React.Component> = new Set();
  private _cache: Map<string, ICacheEntry> = new Map();

  public readonly appSession: AppSession;

  public constructor(appSession: AppSession) {
    this.appSession = appSession;
  }

  public subscribe(component: React.Component): void {
    this._subscribedComponents.add(component);
  }

  public unsubscribe(component: React.Component): void {
    this._subscribedComponents.delete(component);
  }

  public initiateGetEvent(
    component: React.Component,
    eventId: number
  ): ApiTask<EventModel> {
    const apiTaskKey: string = `event:${eventId}`;

    return this._startApiTask<EventModel>(apiTaskKey, component, async () => {
      console.log("Fetching event...");
      const data: Response = await fetch(
        `${this.appSession.serviceUrl}/api/event/${eventId.toString()}`,
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
      const eventModel: EventModel = new EventModel(apiEvent, this.appSession);
      return eventModel;
    });
  }

  public initiateGetEvents(
    component: React.Component,
    filter: "past" | "current"
  ): ApiTask<EventModel[]> {
    const apiTaskKey: string = `events:${filter}`;
    return this._startApiTask(apiTaskKey, component, async () => {
      this._requireLoggedIn();
      console.log("Fetching events...");

      const data: Response = await fetch(
        `${this.appSession.serviceUrl}/api/events?filter=${filter}`,
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
      const eventModels: EventModel[] = apiEvents.map(
        (x) => new EventModel(x, this.appSession)
      );
      return eventModels;
    });
  }

  public async addReservationAsync(eventModel: EventModel): Promise<void> {
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
  }

  public async removeReservationAsync(eventModel: EventModel): Promise<void> {
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
  }

  private _forceUpdate(): void {
    console.log("forceUpdate() " + new Date().toString());
    this._cache.clear();
    for (const component of Array.from(this._subscribedComponents)) {
      try {
        component.forceUpdate();
      } catch (error) {
        console.error("forceUpdate() failed: " + (error as Error).toString());
      }
    }
  }

  private _startApiTask<TResult>(
    apiTaskKey: string,
    component: React.Component,
    action: () => Promise<TResult>
  ): ApiTask<TResult> {
    let cacheEntry: ICacheEntry | undefined = this._cache.get(apiTaskKey);
    if (cacheEntry === undefined) {
      cacheEntry = {
        key: apiTaskKey,
        timestamp: performance.now(),
        task: { status: ApiTaskStatus.Pending },
        components: new Set<React.Component>(),
      };
      this._cache.set(apiTaskKey, cacheEntry);

      const cacheEntry2: ICacheEntry = cacheEntry;
      cacheEntry2.components.add(component);

      action()
        .then((result) => {
          cacheEntry2.task = {
            status: ApiTaskStatus.Success,
            result,
          };
        })
        .catch((error) => {
          cacheEntry2.task = {
            status: ApiTaskStatus.Error,
            error,
          };
        })
        .finally(() => {
          for (const component of Array.from(cacheEntry2.components)) {
            if (this._subscribedComponents.has(component)) {
              try {
                component.forceUpdate();
              } catch (error) {
                console.error(
                  "Uncaught exception: " + (error as Error).toString()
                );
              }
            }
          }
        });
    }

    return cacheEntry.task as ApiTask<TResult>;
  }

  private _requireLoggedIn(): void {
    if (!this.appSession.loggedInUser) {
      throw new Error("Not signed in");
    }
  }
}
