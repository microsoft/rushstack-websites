import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import DOMPurify from 'dompurify';

import styles from './MastodonFeed.module.css';

/**
 * A Mastodon post object, with just the fields of posts that we need.
 */
interface IPostJson {
  id: string;
  created_at: string;
  in_reply_to_id: string | null;
  content: string;
  url: string;
  account: {
    username: string;
    display_name: string;
    avatar: string;
    url: string;
  };
  reblog?: IPostJson;
  media_attachments: {
    type: 'unknown' | 'image' | 'gifv' | 'video' | 'audio';
    url: string;
    preview_url: string;
    description: string;
    blurhash: string;
  }[];
}

export interface ILoadPostsOptions {
  /**
   * Example: `https://mastodon.social/@Mastodon`
   */
  userUrl: string;
  /**
   * Example: `109525862248474026`
   */
  mastodonUserId?: string;
  maxFeedItems?: number;
  includeReplies?: boolean;
}

/**
 * Get the posts for an HTML element and replace that element with the
 * rendered post list.
 */
export async function loadPosts(options: ILoadPostsOptions): Promise<IPostJson[]> {
  const userURL: URL = new URL(options.userUrl);

  // Get the user ID, either from an explicit `data-post-account-id` attribute
  // or by looking it up based on the username in the link.
  const userId: string =
    options.mastodonUserId ??
    (await (async () => {
      // Extract username from URL.
      const parts = /@(\w+)$/.exec(userURL.pathname);
      if (!parts) {
        throw Error('not a Mastodon user URL');
      }
      const username = parts[1];

      // Look up user ID from username.
      const lookupURL = Object.assign(new URL(userURL), {
        pathname: '/api/v1/accounts/lookup',
        search: `?acct=${username}`
      });
      return (await (await fetch(lookupURL)).json())['id'];
    })());

  const maxFeedItems: number = options.maxFeedItems ?? 5;
  const includeReplies: boolean = options.includeReplies ?? false;
  const postURL = Object.assign(new URL(userURL), {
    pathname: `/api/v1/accounts/${userId}/statuses`,
    search: `?limit=${maxFeedItems}&exclude_replies=${!includeReplies}`
  });
  const posts: IPostJson[] = await (await fetch(postURL)).json();
  return posts;
}

interface IMastodonPostProps {
  post: IPostJson;
  userUrl: string;
}

export function MastodonPost(props: IMastodonPostProps): JSX.Element {
  let outerPost: IPostJson = props.post;

  let post: IPostJson = outerPost;

  // Is this a boost (reblog)?
  if (outerPost.reblog) {
    post = outerPost.reblog; // Render the boosted post instead
  }

  const outerPostPageUrl: string = `${props.userUrl}/${outerPost.id}`;

  const nowTime: dayjs.Dayjs = dayjs();
  const createdAtTime: dayjs.Dayjs = dayjs(new Date(outerPost.created_at));
  const hoursAgo: number = nowTime.diff(createdAtTime, 'hour');
  let relativeTime: string;

  if (hoursAgo < 24) {
    // On the same day: "15h"
    relativeTime = `${hoursAgo}h`;
  } else if (nowTime.isSame(createdAtTime, 'year')) {
    // On the same year: "Jan 12"
    relativeTime = createdAtTime.format('MMM D');
  } else {
    // Otherwise: "Jan 12, 2023"
    relativeTime = createdAtTime.format('MMM D, YYYY');
  }

  const images = post.media_attachments.filter((att) => att.type === 'image');

  const safeHtml: string = DOMPurify.sanitize(post.content);

  const statusPrepend: JSX.Element | undefined = outerPost.reblog ? (
    <div className={styles.statusPrepend}>
      <div className={styles.mastodonIcon_boost}></div>
      <div>
        <a
          className={[styles.displayName_account, 'no-external-link-icon'].join(' ')}
          target="_blank"
          rel="noopener noreferrer"
          href={outerPost.account.url}
        >
          {outerPost.account.display_name}
        </a>{' '}
        boosted
      </div>
    </div>
  ) : undefined;

  function status_onClick(event: React.MouseEvent<HTMLDivElement>) {
    // Did we click on something that is not under an <a> tag?
    if (!(event.target as HTMLElement).closest('a')) {
      window.open(outerPostPageUrl, '_blank');
    }
  }

  return (
    <div className={styles.status} onClick={status_onClick}>
      {statusPrepend}
      <div className={styles.status_info}>
        <a
          className={[styles.status_displayName, 'no-external-link-icon'].join(' ')}
          target="_blank"
          rel="noopener noreferrer"
          href={post.account.url}
        >
          <img className={styles.status_avatar} width={46} height={46} src={post.account.avatar} />
          <div>
            <div className={styles.displayName_html}>{post.account.display_name}</div>
            <div className={styles.displayName_account}>@{post.account.username}</div>
          </div>
        </a>
        <a
          className={[styles.status_relativeTime, 'no-external-link-icon'].join(' ')}
          target="_blank"
          rel="noopener noreferrer"
          href={outerPostPageUrl}
        >
          <time dateTime={outerPost.created_at}>{relativeTime}</time>
        </a>
      </div>
      <div className={styles.status_content} dangerouslySetInnerHTML={{ __html: safeHtml }}></div>
      {images.map((att) => (
        <a className="no-external-link-icon" href={att.url} target="_blank" rel="noopener noreferrer">
          <img className={styles.media_gallery} src={att.preview_url} alt={att.description} />
        </a>
      ))}
    </div>
  );
}

export interface IMastodonFeedProps {
  /**
   * Example: `@rushstack@fosstodon.org`
   */
  mastodonUserFullName: string;
  /**
   * Example: `109525862248474026`
   */
  mastodonUserId?: string;
  maxFeedItems?: number;
  includeReplies?: boolean;
}

type FetchState =
  | undefined
  | {
      state: 'error';
      error: Error;
    }
  | { state: 'loaded'; posts: IPostJson[] };

export function MastodonFeed(props: IMastodonFeedProps): JSX.Element {
  const [fetchState, setFetchState] = useState<FetchState>(undefined);

  const parsedMastodonUserFullName: string[] = props.mastodonUserFullName.split('@');
  // Example: "@rushstack@fosstodon.org" --> "rushstack"
  const mastodonUserPart: string = parsedMastodonUserFullName[1] ?? '';
  // Example: "@rushstack@fosstodon.org" --> "fosstodon.org"
  const mastodonServerPart: string = parsedMastodonUserFullName[2] ?? '';
  if (!mastodonUserPart || !mastodonServerPart) {
    throw Error('Invalid mastodonUserFullName');
  }
  const userUrl: string = `https://${mastodonServerPart}/@${mastodonUserPart}`;

  useEffect(() => {
    (async () => {
      try {
        const posts: IPostJson[] = await loadPosts({
          userUrl,
          includeReplies: props.includeReplies,
          mastodonUserId: props.mastodonUserId,
          maxFeedItems: props.maxFeedItems
        });
        setFetchState({ state: 'loaded', posts });
      } catch (error) {
        debugger;
        setFetchState({ state: 'error', error: error as Error });
      }
    })();
  }, [props.mastodonUserFullName, props.includeReplies, props.maxFeedItems, props.mastodonUserId]);

  const posts: IPostJson[] = [];
  let missingPostsNotice: string | undefined;

  if (fetchState === undefined) {
    missingPostsNotice = '. . .';
  } else if (fetchState.state === 'error') {
    missingPostsNotice = `Error: ${fetchState.error.message}`;
  } else {
    posts.push(...fetchState.posts);
    if (posts.length === 0) {
      missingPostsNotice = '(The feed is empty.)';
    }
  }

  return (
    <div className={[styles.feed, 'no-external-link-icon'].join(' ')}>
      <div className={styles.feedHeader}>
        Mastodon feed for{' '}
        <a className="no-external-link-icon" target="_blank" rel="noopener noreferrer" href={userUrl}>
          {props.mastodonUserFullName}
        </a>
      </div>
      {missingPostsNotice ? <div className={styles.status}>{missingPostsNotice}</div> : undefined}
      {posts.map((post, index) => (
        <MastodonPost key={index} post={post} userUrl={userUrl} />
      ))}
    </div>
  );
}
