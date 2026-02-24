import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

import { IPeopleJson, IPersonJson, peopleJson } from './peopleJson';

interface IGitHubCardProps {
  person: IPersonJson;
}

const gitHubBaseUrl = 'https://github.com/';

/**
 * Returns GitHub profile and avatar URLs for a given alias.
 * If the alias is invalid, returns false.
 */
function getGitHubProfileInfo(
  githubAlias: string,
  size: number
): { profileUrl: string; avatarUrl: string } | false {
  // Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.
  // This is from the form validation at https://github.com/signup
  if (/^[A-Za-z0-9-]{1,39}$/.test(githubAlias) === false) {
    console.error(`Invalid GitHub alias: ${githubAlias}`);
    return false;
  }

  const urlBuilder = new URL(gitHubBaseUrl);

  urlBuilder.pathname = githubAlias;
  const profileUrl = urlBuilder.toString();

  urlBuilder.pathname += '.png';
  urlBuilder.searchParams.set('size', size.toString());
  const avatarUrl = urlBuilder.toString();

  return { profileUrl, avatarUrl };
}

// Placeholder profile info for invalid GitHub aliases
const placeholderProfile = { profileUrl: '#', avatarUrl: undefined };

function GitHubCard(props: IGitHubCardProps) {
  const profileInfo = React.useMemo(
    () => getGitHubProfileInfo(props.person.githubAlias, 100),
    [props.person.githubAlias]
  );
  const { profileUrl, avatarUrl } = profileInfo || placeholderProfile;

  return (
    <div className="people-item" style={{ marginBottom: '20px' }}>
      <a href={profileUrl} className="no-external-link-icon">
        <BrowserOnly
          fallback={<img src={avatarUrl} height="100" width="100" style={{ borderRadius: '50%' }} />}
        >
          {() => {
            const size = window.devicePixelRatio >= 2 ? 200 : 100;
            const hiresInfo = getGitHubProfileInfo(props.person.githubAlias, size);
            return (
              <img
                src={hiresInfo ? hiresInfo.avatarUrl : avatarUrl}
                height="100"
                width="100"
                style={{ borderRadius: '50%' }}
              />
            );
          }}
        </BrowserOnly>
      </a>
      <div>
        <a href={profileUrl} className="no-external-link-icon">
          {props.person.name}
        </a>
      </div>
      <div style={{ paddingBottom: '12px' }}>
        <b>@{props.person.githubAlias}</b>
      </div>
      {props.person.role ? (
        <div>
          <i>{props.person.role.toUpperCase()}</i>
        </div>
      ) : undefined}

      {props.person.caption ? (
        <div>
          <i>{props.person.caption}</i>
        </div>
      ) : undefined}
    </div>
  );
}

interface IPeopleGridProps {
  category: keyof IPeopleJson;
}
export function PeopleGrid(props: IPeopleGridProps) {
  const people: IPersonJson[] | undefined = peopleJson[props.category];
  if (!people) {
    throw new Error(`Missing category ${props.category}`);
  }

  return (
    <div className="people-container">
      {people.map((person) => (
        <GitHubCard key={person.githubAlias} person={person} />
      ))}
    </div>
  );
}
