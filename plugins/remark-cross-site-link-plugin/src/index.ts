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

export interface IOptions {
  /**
   * An object containing a key for each supported site prefix, with the associated
   * replacement URL as the value.
   *
   * Example:
   *   {
   *     '@rushjs': 'https://rushjs.io'
   *   }
   */
  prefixes: Record<string, string>;
}

export function plugin(options: IOptions) {
  const prefixes = options.prefixes;

  const transformer = async (ast: Element) => {
    visit(ast, 'link', (node: LinkElement) => {
      if (node.url && node.url.startsWith('@')) {
        const prefix: string = node.url.match(/^(.+?)(\/|$)/)![1];

        // "@site" is a Docusaurus built-in, so we won't touch it
        if (prefix === '@site') return;

        let found = false;

        for (let prefixKey of Object.keys(prefixes)) {
          if (prefix === prefixKey) {
            found = true;
            node.url = prefixes[prefixKey] + node.url.slice(prefix.length);
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
