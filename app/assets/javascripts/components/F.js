'use strict';

import React from 'react';
import { Link } from 'react-router';
import ReactPIXI from 'react-pixi';
import PIXI from 'pixi.js';

var DisplayObjectContainer = React.createFactory(ReactPIXI.DisplayObjectContainer);
var VectorText = React.createFactory(ReactPIXI.Text);

function Footer( props ) {
  return DisplayObjectContainer(
    {},
    VectorText({x:10,y:10, key:'label1', text:'HELP', style:{font:'25px Times'}})
  );
};

export default Footer;