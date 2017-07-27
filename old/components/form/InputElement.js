'use strict';

import React from 'react';
import UI from '../../lib/UI';

export default class InputElement extends UI {

	render () {
		return (
			<input type="text" className="textinput" maxLength={40} />
		)
	}

};
