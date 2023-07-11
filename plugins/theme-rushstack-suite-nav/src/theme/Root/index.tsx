import React from 'react';

import styles from './index.module.css';

interface IPopupMenuItemProps {
  title: string;
  iconPath: string;
  url: string;
}

function PopupMenuItem(props: IPopupMenuItemProps): JSX.Element {
  return (
    <a href={props.url} role="button" className={styles.popupNavItem}>
      <img src={props.iconPath} />
      <div className={styles.popupNavItemLabel}>{props.title}</div>
    </a>
  );
}

class Root extends React.Component<React.PropsWithChildren<{}>> {
  private _showingPopup: boolean = false;

  public render(): JSX.Element {
    let popupPane: JSX.Element | undefined = undefined;

    if (this._showingPopup) {
      popupPane = (
        <div className={styles.popupUnderlay} onClick={this._onClosePopup}>
          <div className={styles.popupPane} onBlur={this._onClosePopup} onClick={this._onIgnoreEvent}>
            <div className={styles.popupHeader} onClick={this._onClosePopup}>
              <div className={styles.waffle}>
                <img src={'/images/suitenav/rs-waffle-dark.svg'} />
              </div>
            </div>

            <div className={styles.popupContent}>
              <PopupMenuItem
                title="Rush Stack"
                iconPath="/images/suitenav/rushstack-icon.svg"
                url="https://rushstack.io/"
              />
              <PopupMenuItem
                title="Rush"
                iconPath="/images/suitenav/rush-icon.svg"
                url="https://rushjs.io/"
              />
              <PopupMenuItem
                title="Heft"
                iconPath="/images/suitenav/heft-icon.svg"
                url="https://heft.rushstack.io/"
              />
              <PopupMenuItem
                title="Lockfile Explorer"
                iconPath="/images/suitenav/lfx-icon.svg"
                url="https://lfx.rushstack.io/"
              />
              <PopupMenuItem
                title="API Extractor"
                iconPath="/images/suitenav/ae-icon.svg"
                url="https://api-extractor.com/"
              />
              <PopupMenuItem
                title="TSDoc"
                iconPath="/images/suitenav/tsdoc-icon.svg"
                url="https://tsdoc.org/"
              />

              <h2 className={styles.popupSubhead}>Have questions?</h2>
              <PopupMenuItem
                title="Chat room"
                iconPath="/images/suitenav/chat-icon.svg"
                url="https://rushstack.io/pages/help/support/"
              />
              <PopupMenuItem
                title="Rush Hour"
                iconPath="/images/suitenav/calendar-icon.svg"
                url="https://rushstack.io/community/events/"
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className={styles.suiteNavBar}>
          <div
            role="button"
            className={[styles.waffle, styles.waffleInteraction].join(' ')}
            onClick={this._onOpenPopup}
          >
            <img src={'/images/suitenav/rs-waffle.svg'} />
          </div>
          <div className={styles.waffleDivider} />

          <a href="https://rushstack.io/" className={styles.suiteNavItem}>
            Rush Stack
          </a>
          <a href="https://rushstack.io/pages/shop/" className={styles.suiteNavItem}>
            Shop
          </a>
          <a href="https://rushstack.io/blog/" className={styles.suiteNavItem}>
            Blog
          </a>
          <a href="https://rushstack.io/community/events/" className={styles.suiteNavItem}>
            Events
          </a>
        </div>

        {popupPane}

        {this.props.children}
      </>
    );
  }

  private _onOpenPopup = () => {
    this._showingPopup = true;
    this.forceUpdate();
  };

  private _onClosePopup = () => {
    this._showingPopup = false;
    this.forceUpdate();
  };

  private _onIgnoreEvent = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };
}

export default Root;
