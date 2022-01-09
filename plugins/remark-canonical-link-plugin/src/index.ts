// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { Parent, Literal } from 'unist';

interface Element extends Parent {
  tagName: string;
}

export function plugin(options: any) {
  const prefix = options.prefix;

  if (!prefix || !prefix.endsWith('/')) {
    throw new Error(`Invalid prefix '${prefix}' - expected a URL prefix ending with a slash (/)`);
  }

  const transformer = async (ast: Element, file: any) => {
    if (file.history && file.history[0] && file.history[0].match(/docs\/(.+)\.md/)) {
      const page = RegExp.$1;
      const canonicalUrl = `${prefix}pages/${page}/`;
      ast.children.unshift({
        type: 'jsx',
        value: `<head><link rel="canonical" href="${canonicalUrl}" /></head>`
      } as Literal);
    }
  };

  return transformer;
}
