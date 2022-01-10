// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import visit from 'unist-util-visit';
import { Parent } from 'unist';

interface Element extends Parent {
  tagName: string;
}

export function plugin() {
  return (tree: Element, file: any) => {
    visit(tree, 'element', (element: Element) => {
      if (element.tagName === 'table') {
        const theadIndex = element.children.findIndex((child: any) => child.tagName === 'thead');

        if (theadIndex >= 0) {
          const thead = element.children[theadIndex];
          let empty = true;

          visit(thead, 'element', (element2: any) => {
            if (element2.tagName === 'th' && element2.children.length > 0) {
              empty = false;
            }
          });

          if (empty) {
            element.children.splice(theadIndex, 1);
          }
        }
      }
    });
  };
}
