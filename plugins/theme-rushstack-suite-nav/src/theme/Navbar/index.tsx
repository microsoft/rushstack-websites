import React from 'react';

// TODO: We are supposed to import "@theme-original/Navbar" here,
// but it produces an infinite loop at runtime
import OriginalNavbar from '@docusaurus/theme-classic/lib-next/theme/Navbar';

function Navbar(): JSX.Element {
  return (
    <div>
      <div>HELLO</div>
      <OriginalNavbar />
    </div>
  );
}

export default Navbar;
