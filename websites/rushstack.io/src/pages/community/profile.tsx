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
import { FormFieldSet } from "../../rscommunity/form/FormFieldSet";
import { FormTextBox, FormTextField } from "../../rscommunity/form/FormTextBox";
import {
  FormComboBox,
  FormComboField,
} from "../../rscommunity/form/FormComboBox";

class ProfilePage extends React.Component {
  private _appSession: AppSession;

  private readonly _formFieldSet: FormFieldSet = new FormFieldSet(this);

  private readonly _fullNameField: FormTextField = new FormTextField(
    this._formFieldSet
  );
  private readonly _nickNameField: FormTextField = new FormTextField(
    this._formFieldSet
  );
  private readonly _verifiedEmailField: FormComboField = new FormComboField(
    this._formFieldSet
  );
  private readonly _companyNameField: FormTextField = new FormTextField(
    this._formFieldSet
  );
  private readonly _companyUrlField: FormTextField = new FormTextField(
    this._formFieldSet
  );
  private readonly _twitterAliasField: FormTextField = new FormTextField(
    this._formFieldSet
  );

  public constructor(props: {}) {
    super(props);
    this._appSession = AppSession.instance;
  }

  public componentDidMount(): void {
    this._appSession.apiDataService.updated.subscribe(
      this,
      this._apiDataService_updated
    );
    this._formFieldSet.updated.subscribe(this, () => {
      this.forceUpdate();
    });
  }

  public componentWillUnmount(): void {
    ObjectEvent.disposeSubscriptionsInvolving(this);
  }

  private _apiDataService_updated = (): void => {
    if (!this._formFieldSet.modified) {
      this._resetFields();
    }
  };

  private _resetFields(): void {
    const apiTask: ApiTask<UserModel> =
      this._appSession.apiDataService.initiateGetProfile(this, true);

    if (apiTask.status === ApiTaskStatus.Success) {
      const apiUser: IApiUser = apiTask.result.apiUser;

      this._formFieldSet.resetFields(() => {
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
      });
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
            disabled={!this._formFieldSet.modified}
            onClick={this._saveButton_onClick}
          >
            Save
          </DecoratedButton>
          <DecoratedButton
            theme="notice"
            disabled={!this._formFieldSet.modified}
            onClick={this._cancelButton_onClick}
          >
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

    this._formFieldSet.resetFields(() => {});

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
    this._resetFields();
  };
}

export default ProfilePage;
