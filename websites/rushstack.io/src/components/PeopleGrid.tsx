import React from 'react';

import { IPeopleJson, IPersonJson, peopleJson } from './peopleJson';

interface IGitHubCardProps {
  person: IPersonJson;
}

const gitHubBaseUrl = 'https://github.com/';

function GitHubCard(props: IGitHubCardProps) {
  const gitHubProfileUrl: string = new URL(props.person.githubAlias, gitHubBaseUrl).toString();

  const size: number = window.devicePixelRatio >= 2 ? 200 : 100;
  const githubAvatarUrl: string = new URL(
    `${props.person.githubAlias}.png?size=${size}`,
    gitHubBaseUrl
  ).toString();

  return (
    <div className="people-item" style={{ marginBottom: '20px' }}>
      <a href={gitHubProfileUrl} className="no-external-link-icon">
        <img src={githubAvatarUrl} width="100" style={{ borderRadius: '50%' }} />
      </a>
      <div>
        <a href={gitHubProfileUrl} className="no-external-link-icon">
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
