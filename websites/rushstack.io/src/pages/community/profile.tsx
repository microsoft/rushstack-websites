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
import {
  FormCheckBox,
  FormCheckField,
} from "../../rscommunity/form/FormCheckBox";

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

  private readonly _optOutOfAllEmails: FormCheckField = new FormCheckField(
    this._formFieldSet
  );
  private readonly _notifyAboutNewEvents: FormCheckField = new FormCheckField(
    this._formFieldSet
  );
  private readonly _discloseOrganization: FormCheckField = new FormCheckField(
    this._formFieldSet
  );
  private readonly _allowUseOfLogo: FormCheckField = new FormCheckField(
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
        if (emailChoices.indexOf(apiUser.verifiedEmail) < 0) {
          emailChoices.push(apiUser.verifiedEmail);
        }

        emailChoices.sort();
        this._verifiedEmailField.choices = emailChoices;

        this._organizationNameField.value = apiUser.organizationName;
        this._organizationUrlField.value = apiUser.organizationUrl;
        this._twitterAliasField.value = apiUser.twitterAlias;

        this._optOutOfAllEmails.checked = apiUser.optOutOfAllEmails;
        this._notifyAboutNewEvents.checked = apiUser.notifyAboutNewEvents;
        this._discloseOrganization.checked = apiUser.discloseOrganization;
        this._allowUseOfLogo.checked = apiUser.allowUseOfLogo;
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
        <div>
          <FormTextBox field={this._fullNameField} />
        </div>
        <p>
          <i>Example: "Cameron Codesmith"</i>
        </p>

        <div className={styles.formHeading}>Nick Name</div>
        <div>
          What name should we use to address you in a meeting or discussion?
        </div>
        <div>
          <FormTextBox field={this._nickNameField} />
        </div>
        <div>
          <i>Example: "Cam"</i>
        </div>

        <div className={styles.formHeading}>Email Notifications</div>
        <div>
          What email address should be used for notifications such as video call
          links?
        </div>
        <div>
          <FormComboBox
            field={this._verifiedEmailField}
            emptyStringMessage="(unspecified)"
          />
        </div>

        <div>
          <label>
            <FormCheckBox field={this._optOutOfAllEmails} />
            Unsubscribe me from all Rush Stack email communications
          </label>
        </div>
        <div>
          <label>
            <FormCheckBox
              field={this._notifyAboutNewEvents}
              disabled={this._optOutOfAllEmails.checked}
            />
            Send me email notifications when new Rush Stack events are posted
          </label>
        </div>
        <p style={{ paddingTop: "20px" }}>
          This website relies on GitHub to verify your email address. The
          choices above are obtained from your{" "}
          <a href="https://github.com/settings/emails" target="_blank">
            GitHub profile emails
          </a>
          . After adding a new email address to your GitHub account, you must
          sign out from the Rush Stack website to refresh the choices. This is
          necessary because our database does not store a GitHub API token.
        </p>
        <p>
          <b>Email privacy:</b> The website does not display your email address
          to other users, and we make a best effort to avoid disclosing it to
          other parties such as advertisers or spammers. We intend for email
          notifications to be infrequent and relevant to topics that you
          expressed interest in. If you have feedback regarding this service,
          please{" "}
          <a
            href="https://github.com/microsoft/rushstack.io-website/issues"
            target="_blank"
          >
            create a GitHub issue.
          </a>
        </p>
        <div className={styles.formHeading}>Company/Organization Name</div>
        <div>
          <FormTextBox field={this._organizationNameField} />
        </div>
        <div className={styles.formHeading}>Company/Organization URL</div>
        <div>
          <FormTextBox field={this._organizationUrlField} />
        </div>
        <div>
          <label>
            <FormCheckBox field={this._discloseOrganization} />I want people to
            know that I'm affiliated with my company/organization.
          </label>
        </div>
        <div>
          <label>
            <FormCheckBox field={this._allowUseOfLogo} />
            My company/organization would like to support Rush Stack by having
            our logo displayed on the website for the components that we use.
          </label>
        </div>
        <div className={styles.formHeading}>Twitter Alias</div>
        <div>
          <FormTextBox field={this._twitterAliasField} />
        </div>
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
        <div className={styles.privacyNoticeBox}>
          <p>
            <b>Privacy notice:</b> Sharing your personal information is
            optional. We value your privacy. Our intent is to implement
            effective security practices and to protect your private data from
            being disclosed without your consent. However, be aware that the
            Rush Stack events, website, and associated software are operated by
            community volunteers and without any guarantees. Mistakes can happen
            sometimes.
          </p>
          <p>
            <b>Disclaimer:</b> Use this Service AT YOUR OWN RISK. It is provided
            "as is", without warranty of any kind, express or implied. In no
            event shall any Operators of this Service be liable for any special,
            direct, indirect, consequential, or incidental damages or any
            damages whatsoever, whether in an action of contract, negligence or
            other tort, arising out of or in connection with the use of the
            Service or the contents of the Service. For details consult the
            GitHub repository{" "}
            <a href="https://github.com/microsoft/rushstack.io-website">
              legal notices
            </a>{" "}
            .
          </p>
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

        optOutOfAllEmails: this._optOutOfAllEmails.checked,
        notifyAboutNewEvents: this._notifyAboutNewEvents.checked,
        discloseOrganization: this._discloseOrganization.checked,
        allowUseOfLogo: this._allowUseOfLogo.checked,
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
