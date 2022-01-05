import React from "react";

import { IApiEvent, IApiUser, IApiUserUpdate } from "./ApiInterfaces";
import { ObjectEvent } from "../library/ObjectEvent";
import { AppSession } from "./AppSession";
import { ApiTask, ApiTaskStatus } from "./ApiTask";
import { EventModel, UserModel } from "./models";

interface ICacheEntry {
  key: string;
  /**
   * Unix Epoch when the cache entry was created, obtained using `Date.now()`
   */
  timestamp: number;
  task: ApiTask<unknown>;
  components: Set<React.Component>;
}

export class ApiDataService {
  public readonly updated: ObjectEvent = new ObjectEvent(this);

  private readonly _cache: Map<string, ICacheEntry> = new Map();
  public readonly appSession: AppSession;

  public constructor(appSession: AppSession) {
    this.appSession = appSession;
  }

  public initiateGetProfile(
    component: React.Component,
    includeEmails: boolean
  ): ApiTask<UserModel> {
    const apiTaskKey: string = `profile:${includeEmails}`;

    return this._startApiTask<UserModel>(apiTaskKey, component, async () => {
      console.log("Fetching profile...");

      const query: string = includeEmails ? "?emails=1" : "";

      const data: Response = await fetch(
        `${this.appSession.serviceUrl}/api/profile${query}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!data.ok) {
        throw new Error("Server Error: " + data.statusText);
      }

      const apiUser: IApiUser = await data.json();
      const userModel: UserModel = new UserModel(apiUser, this.appSession);
      return userModel;
    });
  }

  public async updateProfileAsync(
    apiUserUpdate: IApiUserUpdate
  ): Promise<void> {
    try {
      this._requireLoggedIn();

      console.log("Posting profile update...");
      const data: Response = await fetch(
        `${this.appSession.serviceUrl}/api/profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(apiUserUpdate),
        }
      );

      if (!data.ok) {
        throw new Error("Server Error: " + data.statusText);
      }
    } finally {
      this._invalidateCache();
    }
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
      this._invalidateCache();
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
      this._invalidateCache();
    }
  }

  private _invalidateCache(): void {
    this._cache.clear();
    this.updated.fire({});
  }

  private _startApiTask<TResult>(
    apiTaskKey: string,
    component: React.Component,
    action: () => Promise<TResult>
  ): ApiTask<TResult> {
    let cacheEntry: ICacheEntry | undefined = this._cache.get(apiTaskKey);

    if (cacheEntry !== undefined) {
      const THREE_MINUTES_IN_MS = 3 * 60 * 1000;
      if (Math.abs(Date.now() - cacheEntry.timestamp) > THREE_MINUTES_IN_MS) {
        // Flush cache entries after a few minutes
        // _invalidateCache() will also flush the cache whenever a change is saved
        cacheEntry = undefined;
        this._cache.delete(apiTaskKey);
      }
    }

    if (cacheEntry === undefined) {
      cacheEntry = {
        key: apiTaskKey,
        timestamp: Date.now(),
        task: { status: ApiTaskStatus.Pending },
        components: new Set<React.Component>(),
      };
      this._cache.set(apiTaskKey, cacheEntry);

      const cacheEntry2: ICacheEntry = cacheEntry;
      cacheEntry2.components.add(component);

      (async () => {
        try {
          const result = await action();
          cacheEntry2.task = {
            status: ApiTaskStatus.Success,
            result,
          };
        } catch (error) {
          cacheEntry2.task = {
            status: ApiTaskStatus.Error,
            error: error as Error,
          };
        } finally {
          this.updated.fire({});
        }
      })();
    }

    return cacheEntry.task as ApiTask<TResult>;
  }

  private _requireLoggedIn(): void {
    if (!this.appSession.loggedInUser) {
      throw new Error("Not signed in");
    }
  }
}
