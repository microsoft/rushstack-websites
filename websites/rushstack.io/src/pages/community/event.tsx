import React from 'react';

import { CommunitySidebar } from '../../rscommunity/view/CommunitySidebar';
import { CommunitySignInPage } from '../../rscommunity/view/CommunitySignInPage';
import { AppSession } from '../../rscommunity/api/AppSession';
import { EventCard } from '../../rscommunity/view/EventCard';
import { ObjectEvent } from '../../rscommunity/library/ObjectEvent';
import { ApiTask, ApiTaskStatus } from '../../rscommunity/api/ApiTask';
import { EventModel } from '../../rscommunity/api/models';
import { BrowserOnlyLayout } from '../../rscommunity/view/BrowserOnlyLayout';

class EventPageBody extends React.Component {
  private readonly _appSession: AppSession;

  public constructor(props: {}) {
    super(props);
    this._appSession = AppSession.instance;
  }

  public componentDidMount(): void {
    this._appSession.apiDataService.updated.subscribe(this, () => this.forceUpdate());
  }

  public componentWillUnmount(): void {
    ObjectEvent.disposeSubscriptionsInvolving(this);
  }

  public render(): JSX.Element {
    const queryParams: URLSearchParams = new URLSearchParams(window.location.search);
    let eventId: number | undefined = parseInt(queryParams.get('id') ?? '');
    if (!isNaN(eventId)) {
      eventId = eventId;
    }

    let requireLogin: boolean = false;
    if (queryParams.has('login')) {
      requireLogin = true;
    }

    let eventModel: EventModel | undefined;
    let loggedOutPreview: boolean;

    if (this._appSession.loggedInUser) {
      if (eventId === undefined) {
        return <div>ERROR: Missing event id</div>;
      }

      const eventTask: ApiTask<EventModel> = this._appSession.apiDataService.initiateGetEvent(this, eventId);

      if (eventTask.status === ApiTaskStatus.Error) {
        return <div>ERROR: {eventTask.error.message}</div>;
      }

      if (eventTask.status === ApiTaskStatus.Pending) {
        return <></>;
      }
      eventModel = eventTask.result;
      loggedOutPreview = false;
    } else {
      if (!requireLogin) {
        // If the user is not logged in, see if there is a preview for this event
        const eventTask: ApiTask<EventModel[]> = this._appSession.apiDataService.initiateGetEvents(
          this,
          'preview'
        );

        if (eventTask.status === ApiTaskStatus.Error) {
          return <div>ERROR: {eventTask.error.message}</div>;
        }
        if (eventTask.status === ApiTaskStatus.Pending) {
          return <></>;
        }
        const eventModels: EventModel[] = eventTask.result;

        eventModel = eventModels.find((x) => x.apiEvent.dbEventId === eventId);
      }

      if (eventModel === undefined) {
        // If we can't find an event preview, then require a login
        return <CommunitySignInPage appSession={this._appSession} />;
      }

      loggedOutPreview = true;
    }

    let breadcrumb: JSX.Element = (
      <div>
        &lt;&lt;&nbsp;
        {eventModel.apiEvent.isCompleted ? (
          <a href={'/community/past-events'}>Past Events</a>
        ) : (
          <a href={'/community/events'}>Upcoming Events</a>
        )}
      </div>
    );

    return (
      <CommunitySidebar
        appSession={this._appSession}
        navItem={eventModel.apiEvent.isCompleted ? 'past-events' : 'events'}
        style={{ paddingTop: '100px' }}
      >
        {breadcrumb}

        <div style={{ maxWidth: '800px', paddingBottom: '20px' }}>
          {eventModel ? (
            <EventCard
              cardType="detail"
              loggedOutPreview={loggedOutPreview}
              eventModel={eventModel}
              apiDataService={this._appSession.apiDataService}
              key={eventModel.apiEvent.dbEventId}
            />
          ) : undefined}
        </div>

        {breadcrumb}
      </CommunitySidebar>
    );
  }
}

export function EventPage(props: {}): JSX.Element {
  return (
    <BrowserOnlyLayout>
      <EventPageBody />
    </BrowserOnlyLayout>
  );
}

export default EventPage;
