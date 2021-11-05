import React from 'react';

export function GitHubCard(props) {
  return <div className="people-item">
    <a href={`https://github.com/${props.person.github}`}>
      <img src={`https://github.com/${props.person.github}.png?s=100`} width="100" style={{ borderRadius: "50%" }} />
    </a>
    <div>
      <a href={`https://github.com/${props.person.github}`}>{props.person.name}</a>
    </div>
    <div>
      <b>@{props.person.github}</b>
    </div>
    <div>
      <i>{props.person.caption}</i>
    </div>
  </div>;
}

export function GitHubCardContainer(props) {
  return <div className="people-container">
    {props.people.map(person => <GitHubCard person={person} />)}
  </div>;
}
