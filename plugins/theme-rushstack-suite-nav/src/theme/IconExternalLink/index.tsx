import React from 'react';

// Docusaurus detects "external links" using an inaccurate test in isInternalUrl() with
// no way to customize the logic.  Instead of trying to fix that, we hide the "IconExternalLink" component
// and will instead render our own icon using CSS selectors.
function IconExternalLink(props: {}): JSX.Element {
  return <></>;
}

export default IconExternalLink;
