'use strict';

import React from 'react';
import { Link } from 'react-router';

function Footer( props ) {
  return (
    <footer className='Footer'>
        <div className="inner">
          <Link to="/login">Login</Link>
          <Link to="/termsandconditions">Terms and Conditions</Link>
          <p>Copyright 2016</p>
        </div>
      </footer>
  );
};

export default Footer;