'use strict';

import React from 'react';
import Navigation from './navigation/Navigation';

function Header( props ) {
  return (
      <header className='Header'>
      	<Navigation />
		<h4 className="highscore small">{ props.score }</h4>
      </header>
  );
};

export default Header;