import { IApiEvent, IApiUser } from './ApiInterfaces';
import { AppSession } from './AppSession';

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

  public onNavigateToEventDetailPageRequireLogin = (): void => {
    this.appSession.navigateToEventDetailPage(this.apiEvent.dbEventId, true);
  };

  public onAddReservation = (): void => {
    this.appSession.apiDataService.addReservationAsync(this).catch((error) => {
      console.error((error as Error).toString());
    });
  };

  public onAddReservationAndNavigate = (): void => {
    (async () => {
      await this.appSession.apiDataService.addReservationAsync(this);

      // After successfully adding the reservation, navigate to the event detail page
      await this.onNavigateToEventDetailPage();
    })().catch((error) => {
      console.error((error as Error).toString());
    });
  };

  public onRemoveReservation = (): void => {
    this.appSession.apiDataService.removeReservationAsync(this).catch((error) => {
      console.error((error as Error).toString());
    });
  };
}

export class UserModel {
  public readonly apiUser: IApiUser;
  public readonly appSession: AppSession;

  public constructor(apiUser: IApiUser, appSession: AppSession) {
    this.apiUser = apiUser;
    this.appSession = appSession;
  }
}
