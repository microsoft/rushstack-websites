// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import visit from 'unist-util-visit';
import { Parent } from 'unist';

interface Element extends Parent {
  tagName: string;
}

interface LinkElement extends Element {
  url: string;
}

export function plugin(options: any) {
  const prefixes = options.prefixes;

  const transformer = async (ast: Element) => {
    visit(ast, 'link', (node: LinkElement) => {
      if (node.url && node.url.startsWith('@')) {
        // "@site" is a Docusaurus built-in, so we won't touch it
        if (node.url.startsWith('@site')) return;

        let found = false;

        for (let prefix of Object.keys(prefixes)) {
          if (node.url.startsWith(prefix)) {
            found = true;
            node.url = prefixes[prefix] + node.url.slice(prefix.length);
            break;
          }
        }

        if (!found) {
          throw new Error(
            `Link with url '${node.url}' has unknown prefix (expected one of ${JSON.stringify(
              Object.keys(prefixes)
            )})`
          );
        }
      }
    });
  };

  return transformer;
}
