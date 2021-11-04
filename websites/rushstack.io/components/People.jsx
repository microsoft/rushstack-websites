import React from 'react';

import { GitHubCardContainer } from './GitHubCard';
import * as PEOPLE_JSON from '../people.json';

export function PeopleGrid(props) {
  const people = PEOPLE_JSON[props.category];
  return <GitHubCardContainer people={people} />;
}
