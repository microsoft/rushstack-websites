// eslint-disable-next-line
type AnyArgs = any;

interface ITrackedSubscription {
  event: ObjectEvent;

  handlerOwner: ObjectEventParticipant;

  handler: ObjectEventHandler<AnyArgs>;
}

interface ITrackedParticipant {
  /**
   * A "participant" is any object that is an "event owner" or a "handler owner" or both.
   */
  participant: ObjectEventParticipant;

  ownedEvents: Set<ObjectEvent<AnyArgs>>;
  subscriptions: Set<ITrackedSubscription>;
}

// eslint-disable-next-line
export type ObjectEventParticipant = any;

export interface IObjectEventArgs {}

export type ObjectEventHandler<TArgs extends IObjectEventArgs> = (args?: TArgs) => void;

export class ObjectEvent<TArgs extends IObjectEventArgs = {}> {
  private readonly _eventOwner: ObjectEventParticipant;

  private readonly _subscriptionsByHandler: Map<ObjectEventHandler<AnyArgs>, ITrackedSubscription> =
    new Map();

  private _cachedHandlers: ObjectEventHandler<AnyArgs>[] | undefined = undefined;

  private static _participantsByObject: WeakMap<ObjectEventParticipant, ITrackedParticipant> = new WeakMap();

  public constructor(eventOwner: ObjectEventParticipant) {
    if (eventOwner === undefined) {
      throw new Error('eventOwner is undefined');
    }
    this._eventOwner = eventOwner;

    const participant: ITrackedParticipant = ObjectEvent._fetchTrackedParticipant(this._eventOwner);
    participant.ownedEvents.add(this);
  }

  /**
   * Adds a "handler" callback function that will be invoked when this event is fired.
   *
   * @param handlerOwner - the object that `handler` belongs to, for usage
   *   with {@link ObjectEvent.disposeSubscriptionsInvolving}
   * @param handler - the callback function to be invoked when the event is fired
   */
  public subscribe(handlerOwner: ObjectEventParticipant, handler: ObjectEventHandler<TArgs>): void {
    if (handlerOwner === undefined) {
      throw new Error('handlerOwner is undefined');
    }
    if (handler === undefined) {
      throw new Error('handlerOwner is undefined');
    }

    if (this._subscriptionsByHandler.has(handler)) {
      throw new Error('Event handler has already been subscribed');
    }

    const subscription: ITrackedSubscription = {
      event: this,
      handlerOwner,
      handler
    };
    this._subscriptionsByHandler.set(handler, subscription);
    this._cachedHandlers = undefined;

    const handlerOwnerParticipant: ITrackedParticipant = ObjectEvent._fetchTrackedParticipant(handlerOwner);
    handlerOwnerParticipant.subscriptions.add(subscription);
  }

  /**
   * Removes a "handler" callback function that was added by {@link ObjectEvent.subscribe}.
   */
  public unsubscribe(handler: ObjectEventHandler<TArgs>): void {
    const subscription: ITrackedSubscription | undefined = this._subscriptionsByHandler.get(handler);
    if (subscription !== undefined) {
      this._subscriptionsByHandler.delete(handler);
      this._cachedHandlers = undefined;

      const handlerOwnerParticipant: ITrackedParticipant = ObjectEvent._fetchTrackedParticipant(
        subscription.handlerOwner
      );
      handlerOwnerParticipant.subscriptions.delete(subscription);
    }
  }

  /**
   * Removes all "handler" callback functions that were added by {@link ObjectEvent.subscribe}.
   */
  public unsubscribeAll(): void {
    for (const subscription of Array.from(this._subscriptionsByHandler.values())) {
      const handlerOwnerParticipant: ITrackedParticipant = ObjectEvent._fetchTrackedParticipant(
        subscription.handlerOwner
      );
      handlerOwnerParticipant.subscriptions.delete(subscription);
    }

    this._subscriptionsByHandler.clear();
    this._cachedHandlers = undefined;
  }

  /**
   * Triggers the event, by invoking the "handler" callback functions that were added
   * by {@link ObjectEvent.subscribe}.  The handlers are called in the order in which they
   * were subscribed.
   */
  public fire(eventArgs: TArgs): void {
    if (eventArgs === undefined) {
      throw new Error('eventArgs is undefined');
    }

    if (this._cachedHandlers === undefined) {
      this._cachedHandlers = [];
      if (this._subscriptionsByHandler.size > 0) {
        for (const subscription of Array.from(this._subscriptionsByHandler.values())) {
          this._cachedHandlers.push(subscription.handler);
        }
      }
    }

    for (const handler of this._cachedHandlers) {
      handler(eventArgs);
    }
  }

  // STATIC MEMBERS

  /**
   * Unsubscribes any event handlers belonging to `eventParticipant`, and also calls
   * {@link ObjectEvent.unsubscribeAll} for any events owned by `eventParticipant`.
   */
  public static disposeSubscriptionsInvolving(participant: ObjectEventParticipant): void {
    if (participant === undefined) {
      throw new Error('eventOwner is undefined');
    }

    const trackedParticipant: ITrackedParticipant = ObjectEvent._fetchTrackedParticipant(participant);

    // Unsubscribe any handlers attached to any owned events
    for (const event of Array.from(trackedParticipant.ownedEvents)) {
      event.unsubscribeAll();
    }

    // Unsubscribe any handlers belonging to this object
    for (const subscription of Array.from(trackedParticipant.subscriptions.values())) {
      // INLINE: subscription.event.unsubscribe(subscription.handler);
      const event: ObjectEvent = subscription.event;
      event._subscriptionsByHandler.delete(subscription.handler);
      event._cachedHandlers = undefined;

      const handlerOwnerParticipant: ITrackedParticipant = ObjectEvent._fetchTrackedParticipant(
        subscription.handlerOwner
      );
      handlerOwnerParticipant.subscriptions.delete(subscription);
    }
  }

  private static _fetchTrackedParticipant(participant: ObjectEventParticipant): ITrackedParticipant {
    let trackedParticipant: ITrackedParticipant | undefined = this._participantsByObject.get(participant);

    if (trackedParticipant === undefined) {
      trackedParticipant = {
        participant: participant,
        ownedEvents: new Set(),
        subscriptions: new Set()
      };
      this._participantsByObject.set(participant, trackedParticipant);
    }
    return trackedParticipant;
  }
}
