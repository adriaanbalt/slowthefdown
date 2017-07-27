import React from 'react';
import classNames from 'classnames'

const CoinPoloniex = (props) => (
    <div className='row columns'>
    	<span className="name">{ props.name }</span>
    	<span>{ props.values[0] } </span>
    	<span>{ props.values[1] } </span>
    	<span>{ props.values[2] } </span>
    	<span>{ props.values[3] } </span>
    	<span>{ props.values[4] } </span>
    	<span>{ props.values[5] } </span>
    </div>
)

export default CoinPoloniex