import React from "react";
import styles from "./profile.module.css";

import { CommunitySidebarLayout } from "../../rscommunity/view/CommunitySidebarLayout";
import { CommunitySignInPage } from "../../rscommunity/view/CommunitySignInPage";
import { AppSession } from "../../rscommunity/api/AppSession";
import { IApiUser } from "../../rscommunity/api/ApiInterfaces";
import { ObjectEvent } from "../../rscommunity/library/ObjectEvent";
import { DecoratedButton } from "../../rscommunity/view/DecoratedButton";
import { FormFieldSet } from "../../rscommunity/form/FormFieldSet";
import { FormTextBox, FormTextField } from "../../rscommunity/form/FormTextBox";
import {
  FormComboBox,
  FormComboField,
} from "../../rscommunity/form/FormComboBox";
import { ApiTask, ApiTaskStatus } from "../../rscommunity/api/ApiTask";
import { UserModel } from "../../rscommunity/api/models";

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
  private readonly _organizationNameField: FormTextField = new FormTextField(
    this._formFieldSet
  );
  private readonly _organizationUrlField: FormTextField = new FormTextField(
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

        this._organizationNameField.value = apiUser.organizationName;
        this._organizationUrlField.value = apiUser.organizationUrl;
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
        style={{ paddingTop: "100px", maxWidth: "600px" }}
      >
        <h1>Your Profile</h1>

        <div className={styles.formHeading}>Full Name</div>
        <FormTextBox field={this._fullNameField} />
        <p>
          <i>Example: "Cameron Codesmith"</i>
        </p>

        <div className={styles.formHeading}>Nick Name</div>
        <div>
          What name should we use to address you in a meeting or discussion?
        </div>
        <FormTextBox field={this._nickNameField} />
        <div>
          <i>Example: "Cam"</i>
        </div>

        <div className={styles.formHeading}>Email for Notifications</div>
        <FormComboBox field={this._verifiedEmailField} />
        <p>
          The Rush Stack website relies on GitHub to verify your email address.
          The choices in this box are obtained from your{" "}
          <a href="https://github.com/settings/emails" target="_blank">
            GitHub emails list
          </a>
          . After adding a new email address to your GitHub profile, you must
          sign out from the Rush Stack website to refresh the choices. This is
          necessary because our database does not store a GitHub API token.
        </p>
        <p>
          <b>Email privacy:</b> Your email address is only intended to be used
          for notifications and reminders related to the website and community
          events. These notifications should be infrequent and limited to topics
          that you expressed interest in. The website does not display your
          email address to other users. This service is operated by community
          volunteers who make a best effort to prevent your email address from
          being disclosed to other parties such as advertisers or spammers.
        </p>

        <div className={styles.formHeading}>Company/Organization Name</div>
        <FormTextBox field={this._organizationNameField} />

        <div className={styles.formHeading}>Company/Organization URL</div>
        <FormTextBox field={this._organizationUrlField} />

        <div className={styles.formHeading}>Twitter Alias</div>
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
    const userTask: ApiTask<UserModel> =
      this._appSession.apiDataService.initiateGetProfile(this, true);

    if (userTask.status !== ApiTaskStatus.Success) {
      return;
    }

    const apiUser: IApiUser = userTask.result.apiUser;

    this._formFieldSet.resetFields(() => {});

    this._appSession.apiDataService
      .updateProfileAsync({
        dbUserId: apiUser.dbUserId,
        verifiedEmail: this._verifiedEmailField.value,

        fullName: this._fullNameField.value,
        nickName: this._nickNameField.value,

        organizationName: this._organizationNameField.value,
        organizationUrl: this._organizationUrlField.value,
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
