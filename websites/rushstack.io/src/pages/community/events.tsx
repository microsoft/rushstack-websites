import React from 'react';

import { CommunitySidebar } from '../../rscommunity/view/CommunitySidebar';
import { CommunitySignInPage } from '../../rscommunity/view/CommunitySignInPage';
import { AppSession } from '../../rscommunity/api/AppSession';
import { EventCard } from '../../rscommunity/view/EventCard';
import { ObjectEvent } from '../../rscommunity/library/ObjectEvent';
import { EventModel } from '../../rscommunity/api/models';
import { ApiTask, ApiTaskStatus } from '../../rscommunity/api/ApiTask';
import { BrowserOnlyLayout } from '../../rscommunity/view/BrowserOnlyLayout';

class EventsPageBody extends React.Component {
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
    const eventTask: ApiTask<EventModel[]> = this._appSession.apiDataService.initiateGetEvents(
      this,
      this._appSession.loggedInUser ? 'current' : 'preview'
    );

    if (eventTask.status === ApiTaskStatus.Error) {
      return <div>ERROR: {eventTask.error.message}</div>;
    }
    if (eventTask.status === ApiTaskStatus.Pending) {
      return <></>;
    }
    const eventModels: EventModel[] = eventTask.result;

    let content: JSX.Element = <i>No events have been posted yet.</i>;
    if (eventModels.length > 0) {
      content = (
        <>
          {eventModels.map((eventModel) => (
            <EventCard
              cardType="summary"
              loggedOutPreview={!this._appSession.loggedInUser}
              eventModel={eventModel}
              apiDataService={this._appSession.apiDataService}
              key={eventModel.apiEvent.dbEventId}
            />
          ))}
        </>
      );
    }

    return (
      <CommunitySidebar appSession={this._appSession} navItem="events" style={{ paddingTop: '100px' }}>
        <h1>Upcoming Events</h1>
        <div style={{ maxWidth: '800px' }}>{content}</div>
      </CommunitySidebar>
    );
  }
}

export function EventsPage(props: {}): JSX.Element {
  return (
    <BrowserOnlyLayout>
      <EventsPageBody />
    </BrowserOnlyLayout>
  );
}

export default EventsPage;
