'use strict';

import React from 'react';
import Icon from './Icon';

function Instructions( props ) {
  return (
	<div className="instructions" onClick={ props.toggleInstructions } onTouchStart={ props.toggleInstructions }>
		<div className="inner">
			<Icon name="icon-close"/>
			<h2>How to play</h2>
			<p>The longer you follow the F with your thumb the higher your score.</p>
			<p>The white number is your progress. The red number is your high score.</p>
		</div>
	</div>
  );
};

export default Instructions;

