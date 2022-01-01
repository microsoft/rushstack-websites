import React from "react";

import { CommunitySidebarLayout } from "../../rscommunity/view/CommunitySidebarLayout";
import { CommunitySignInPage } from "../../rscommunity/view/CommunitySignInPage";
import { AppSession } from "../../rscommunity/model/AppSession";
import {
  ApiTask,
  ApiTaskStatus,
  UserModel,
} from "../../rscommunity/model/ApiDataService";
import { IApiUser } from "../../rscommunity/ApiInterfaces";
import { ObjectEvent } from "../../rscommunity/library/ObjectEvent";

class FormTextField {
  public readonly updated: ObjectEvent = new ObjectEvent(this);

  private _value: string = "";

  public constructor(component?: React.Component) {
    if (component) {
      this.updated.subscribe(component, () => component.forceUpdate());
    }
  }

  public get value(): string {
    return this._value;
  }

  public set value(value: string) {
    if (this._value !== value) {
      this._value = value;
      this.updated.fire({});
    }
  }

  public onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.value = event.target.value;
  };
}

export function FormTextInput(props: { field: FormTextField }): JSX.Element {
  return <input value={props.field.value} onChange={props.field.onChange} />;
}

class ProfilePage extends React.Component {
  private _appSession: AppSession;

  private _formInitialized: boolean = false;
  private readonly _fullName: FormTextField = new FormTextField(this);
  private readonly _nickName: FormTextField = new FormTextField(this);
  private readonly _companyName: FormTextField = new FormTextField(this);
  private readonly _companyUrl: FormTextField = new FormTextField(this);
  private readonly _twitterAlias: FormTextField = new FormTextField(this);

  public constructor(props: {}) {
    super(props);
    this._appSession = AppSession.instance;
  }

  public componentDidMount(): void {
    this._appSession.apiDataService.updated.subscribe(
      this,
      this._apiDataService_updated
    );
    this._formInitialized = false;
  }
  public componentWillUnmount(): void {
    ObjectEvent.disposeSubscriptionsInvolving(this);
  }

  private _apiDataService_updated = (): void => {
    if (!this._formInitialized) {
      const apiTask: ApiTask<UserModel> =
        this._appSession.apiDataService.initiateGetUser(this, true);

      if (apiTask.status === ApiTaskStatus.Success) {
        const apiUser: IApiUser = apiTask.result.apiUser;

        this._fullName.value = apiUser.fullName;
        this._nickName.value = apiUser.nickName;
        this._companyName.value = apiUser.companyName;
        this._companyUrl.value = apiUser.companyUrl;
        this._twitterAlias.value = apiUser.twitterAlias;
        this._formInitialized = true;
      }
    }

    this.forceUpdate();
  };

  public render(): JSX.Element {
    console.log("ProfilePage render");
    if (!this._appSession.loggedInUser) {
      return <CommunitySignInPage appSession={this._appSession} />;
    }

    const apiTask: ApiTask<UserModel> =
      this._appSession.apiDataService.initiateGetUser(this, true);

    if (apiTask.status === ApiTaskStatus.Error) {
      return <div>ERROR: {apiTask.error.message}</div>;
    }
    if (apiTask.status === ApiTaskStatus.Pending) {
      return <></>;
    }

    const apiUser: IApiUser = apiTask.result.apiUser;

    const emailChoices: string[] = apiUser.verifiedEmailChoices || [];
    if (apiUser.verifiedEmail) {
      if (emailChoices.indexOf(apiUser.verifiedEmail) < 0) {
        emailChoices.push(apiUser.verifiedEmail);
      }
    }
    emailChoices.sort();

    let optionKey: number = 0;
    const emailOptionElements: JSX.Element[] = emailChoices.map((x) => (
      <option key={optionKey++} value={x}>
        {x}
      </option>
    ));

    return (
      <CommunitySidebarLayout
        appSession={this._appSession}
        navItem={"profile"}
        style={{ paddingTop: "100px" }}
      >
        <h1>Your Profile</h1>

        <div>Full Name</div>
        <FormTextInput field={this._fullName} />

        <div>Nick Name</div>
        <FormTextInput field={this._nickName} />

        <div>Email for Notifications</div>
        <select defaultValue={apiUser.verifiedEmail}>
          {emailOptionElements}
        </select>

        <div>Company Name</div>
        <FormTextInput field={this._companyName} />

        <div>Company URL</div>
        <FormTextInput field={this._companyUrl} />

        <div>Twitter Alias</div>
        <FormTextInput field={this._twitterAlias} />
      </CommunitySidebarLayout>
    );
  }
}

export default ProfilePage;
