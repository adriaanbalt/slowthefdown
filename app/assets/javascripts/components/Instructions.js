'use strict';

import React from 'react';
import Icon from './Icon';

function Instructions( props ) {
  return (
	<div className="instructions" onClick={ props.toggleInstructions } onTouchStart={ props.toggleInstructions }>
		<div className="inner">
			<Icon name="icon-close"/>
			<h2>How to play</h2>
			<p>The longer you follow the F with your finger the higher your score.</p>
		</div>
	</div>
  );
};

export default Instructions;

