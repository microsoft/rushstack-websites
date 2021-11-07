const visit = require('unist-util-visit');

/**
 * In Kramdown, which we used in the Jekyll docs, you can create headerless tables
 * using markdown. This isn't allowed in MDX, but we can circumvent by detecting and
 * suppressing an "empty" header and removing the <thead> tag.
 *
 * In the markdown doc, you would write:
 *
 *   | | |
 *   | --- | --- |
 *   | My Content | My Content |
 *
 * This produces:
 *
 *   <table>
 *     <thead>
 *       <tr><th></th><th></th></tr>
 *     </thead>
 *     <tbody>
 *       <tr><td>My Content</td><td>My Content</td></tr>
 *     </tbody>
 *   </table>
 *
 * This Rehype plugin runs after markdown has been converted into HTML, and detects
 * and removes a <thead> tag containing an empty <th> tag.
 */
module.exports = function () {
  return (tree, file) => {
    visit(tree, 'element', element => {
      if (element.tagName === 'table') {
        const theadIndex = element.children.findIndex(child => child.tagName === 'thead');

        if (theadIndex >= 0) {
          const thead = element.children[theadIndex];
          let empty = false;

          visit(thead, 'element', element2 => {
            if (element2.tagName === 'th' && element2.children.length === 0) {
              empty = true;
            }
          });

          if (empty) {
            element.children.splice(theadIndex, 1);
          }
        }
      }
    });
  };
};
