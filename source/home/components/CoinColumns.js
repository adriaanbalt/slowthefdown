
import React from 'react';
import classNames from 'classnames'

const CoinBittrex = (props) => (
     <div className='columns columns-header'>
          <span className='name'>Coin Name</span>
          <div className="quantities">
               <span onClick={ props.changeQuantityViews } className={`quantity Ask${ props.quantityViews.current == 'ask' ? ' is-active' : '' }`}>Ask</span>
               <span onClick={ props.changeQuantityViews } className={`quantity Bid${ props.quantityViews.current == 'bid' ? ' is-active' : '' }`}>Bid</span>
               <span onClick={ props.changeQuantityViews } className={`quantity Last${ props.quantityViews.current == 'last' ? ' is-active' : '' }`}>Last</span>
               <span onClick={ props.changeQuantityViews } className={`quantity High${ props.quantityViews.current == 'high' ? ' is-active' : '' }`}>High</span>
               <span onClick={ props.changeQuantityViews } className={`quantity Low${ props.quantityViews.current == 'low' ? ' is-active' : '' }`}>Low</span>
               <span onClick={ props.changeQuantityViews } className={`quantity BaseVolume${ props.quantityViews.current == 'basevolume' ? ' is-active' : '' }`}>Base Volume</span>
               <span onClick={ props.changeQuantityViews } className={`quantity Volume${ props.quantityViews.current == 'volume' ? ' is-active' : '' }`}>Volume</span>
               <span onClick={ props.changeQuantityViews } className={`quantity OpenBuyOrders${ props.quantityViews.current == 'openbuyorders' ? ' is-active' : '' }`}>Open Buy Orders</span>
               <span onClick={ props.changeQuantityViews } className={`quantity OpenSellOrders${ props.quantityViews.current == 'opensellorders' ? ' is-active' : '' }`}>Open Sell Orders</span>
          </div>
     </div>
)

export default CoinBittrex