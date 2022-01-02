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
import { DecoratedButton } from "../../rscommunity/view/DecoratedButton";

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

export function FormTextBox(props: { field: FormTextField }): JSX.Element {
  return <input value={props.field.value} onChange={props.field.onChange} />;
}

class FormComboField {
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

  public choices: string[] = [];

  public onChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    this.value = event.target.value;
  };
}

export function FormComboBox(props: { field: FormComboField }): JSX.Element {
  let optionKey: number = 0;
  const openElements: JSX.Element[] = props.field.choices.map((x) => (
    <option key={optionKey++} value={x}>
      {x}
    </option>
  ));

  return (
    <select value={props.field.value} onChange={props.field.onChange}>
      {openElements}
    </select>
  );
}

class ProfilePage extends React.Component {
  private _appSession: AppSession;

  private _formInitialized: boolean = false;
  private readonly _fullNameField: FormTextField = new FormTextField(this);
  private readonly _nickNameField: FormTextField = new FormTextField(this);
  private readonly _verifiedEmailField: FormComboField = new FormComboField(
    this
  );
  private readonly _companyNameField: FormTextField = new FormTextField(this);
  private readonly _companyUrlField: FormTextField = new FormTextField(this);
  private readonly _twitterAliasField: FormTextField = new FormTextField(this);

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
      this._assignFields();
      this._formInitialized = false;
    }

    this.forceUpdate();
  };

  private _assignFields(): void {
    const apiTask: ApiTask<UserModel> =
      this._appSession.apiDataService.initiateGetProfile(this, true);

    if (apiTask.status === ApiTaskStatus.Success) {
      const apiUser: IApiUser = apiTask.result.apiUser;

      this._fullNameField.value = apiUser.fullName;
      this._nickNameField.value = apiUser.nickName;
      this._verifiedEmailField.value = apiUser.verifiedEmail;

      const emailChoices: string[] = apiUser.verifiedEmailChoices || [];
      if (apiUser.verifiedEmail) {
        if (emailChoices.indexOf(apiUser.verifiedEmail) < 0) {
          emailChoices.push(apiUser.verifiedEmail);
        }
      }
      emailChoices.sort();
      this._verifiedEmailField.choices = emailChoices;

      this._companyNameField.value = apiUser.companyName;
      this._companyUrlField.value = apiUser.companyUrl;
      this._twitterAliasField.value = apiUser.twitterAlias;
      this._formInitialized = true;
    }
  }

  public render(): JSX.Element {
    console.log("ProfilePage render");
    if (!this._appSession.loggedInUser) {
      return <CommunitySignInPage appSession={this._appSession} />;
    }

    const apiTask: ApiTask<UserModel> =
      this._appSession.apiDataService.initiateGetProfile(this, true);

    if (apiTask.status === ApiTaskStatus.Error) {
      return <div>ERROR: {apiTask.error.message}</div>;
    }
    if (apiTask.status === ApiTaskStatus.Pending) {
      return <></>;
    }

    return (
      <CommunitySidebarLayout
        appSession={this._appSession}
        navItem={"profile"}
        style={{ paddingTop: "100px" }}
      >
        <h1>Your Profile</h1>

        <div>Full Name</div>
        <FormTextBox field={this._fullNameField} />

        <div>Nick Name</div>
        <FormTextBox field={this._nickNameField} />

        <div>Email for Notifications</div>
        <FormComboBox field={this._verifiedEmailField} />

        <div>Company Name</div>
        <FormTextBox field={this._companyNameField} />

        <div>Company URL</div>
        <FormTextBox field={this._companyUrlField} />

        <div>Twitter Alias</div>
        <FormTextBox field={this._twitterAliasField} />

        <div>
          <DecoratedButton
            style={{ paddingTop: "20px", paddingRight: "20px" }}
            theme="default"
            onClick={this._saveButton_onClick}
          >
            Save
          </DecoratedButton>
          <DecoratedButton theme="notice" onClick={this._cancelButton_onClick}>
            Cancel
          </DecoratedButton>
        </div>
      </CommunitySidebarLayout>
    );
  }

  private _saveButton_onClick = (): void => {
    const apiTask: ApiTask<UserModel> =
      this._appSession.apiDataService.initiateGetProfile(this, true);

    if (apiTask.status !== ApiTaskStatus.Success) {
      return;
    }

    const apiUser: IApiUser = apiTask.result.apiUser;

    this._appSession.apiDataService
      .updateProfileAsync({
        dbUserId: apiUser.dbUserId,
        verifiedEmail: this._verifiedEmailField.value,

        fullName: this._fullNameField.value,
        nickName: this._nickNameField.value,

        companyName: this._companyNameField.value,
        companyUrl: this._companyUrlField.value,
        twitterAlias: this._twitterAliasField.value,
      })
      .catch((error) => {
        console.error((error as Error).toString());
      });
  };

  private _cancelButton_onClick = (): void => {
    this._assignFields();
  };
}

export default ProfilePage;
