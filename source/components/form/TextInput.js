'use strict';

import React from 'react';

function TextInput( props ) {
  return (
      <input ref="input" type="text" className="textinput" name="textinput" placeholder={ props.placeholder} onFocus={ props.onFocus } onChange={ props.onChange }/>
  );
};

export default TextInput;