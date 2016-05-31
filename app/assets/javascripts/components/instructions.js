'use strict';

import React from 'react';

function Instructions( props ) {
  return (
	<div className="instructions" onClick={ props.toggleInstructions } onTouchStart={ props.toggleInstructions }>
		<div className="inner">
			<h2>How to play</h2>
			<p>The longer you follow the F with your thumb the higher your score</p>
		</div>
	</div>
  );
};

export default Instructions;

