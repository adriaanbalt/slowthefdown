import React from 'react';
import classNames from 'classnames'

const CoinBittrex = (props) => (
	<div className='row columns'>
		<span className="name">{ props.name }</span>
		<div className="quantities">
			<span onClick={ props.changeQuantityViews } className={`quantity Ask${ props.quantityViews.current == 'ask' ? ' is-active' : '' }`}>{ props.values.Ask } </span>
			<span onClick={ props.changeQuantityViews } className={`quantity Bid${ props.quantityViews.current == 'bid' ? ' is-active' : '' }`}>{ props.values.Bid } </span>
			<span onClick={ props.changeQuantityViews } className={`quantity Last${ props.quantityViews.current == 'last' ? ' is-active' : '' }`}>{ props.values.Last } </span>
			<span onClick={ props.changeQuantityViews } className={`quantity High${ props.quantityViews.current == 'high' ? ' is-active' : '' }`}>{ props.values.High } </span>
			<span onClick={ props.changeQuantityViews } className={`quantity Low${ props.quantityViews.current == 'low' ? ' is-active' : '' }`}>{ props.values.Low } </span>
			<span onClick={ props.changeQuantityViews } className={`quantity BaseVolume${ props.quantityViews.current == 'basevolume' ? ' is-active' : '' }`}>{ props.values.BaseVolume } </span>
			<span onClick={ props.changeQuantityViews } className={`quantity Volume${ props.quantityViews.current == 'volume' ? ' is-active' : '' }`}>{ props.values.Volume } </span>
			<span onClick={ props.changeQuantityViews } className={`quantity OpenBuyOrders${ props.quantityViews.current == 'openbuyorders' ? ' is-active' : '' }`}>{ props.values.OpenBuyOrders } </span>
			<span onClick={ props.changeQuantityViews } className={`quantity OpenSellOrders${ props.quantityViews.current == 'opensellorders' ? ' is-active' : '' }`}>{ props.values.OpenSellOrders } </span>
		</div>
	</div>
)

export default CoinBittrex