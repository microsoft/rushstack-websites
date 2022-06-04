export interface IPersonJson {
  name: string;
  githubAlias: string;
  role?: string;
  caption?: string;
}

export interface IPeopleJson {
  maintainers: IPersonJson[];
  collaborators: IPersonJson[];
  alumni: IPersonJson[];
  starContributors: IPersonJson[];
}

import * as peopleJsonFile from '../../data/people.json';
const peopleJson: IPeopleJson = peopleJsonFile;

export { peopleJson };
