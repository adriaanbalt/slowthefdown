'use strict';

import React from 'react';
import Navigation from './navigation/Navigation';

function Header( props ) {
  return (
	  <header className='Header'>
		<Navigation />
		<h4 className="highscore big"><span className="copy">Highscore:</span>{ props.highscore }</h4>
		<h4 className="highscore small"><span className="copy">Progress:</span>{ props.score }</h4>
	  </header>
  );
};

export default Header;