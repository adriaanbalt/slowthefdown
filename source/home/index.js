import './home.scss'
import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'
import io from 'socket.io-client'

import {
  changeQuantityViews,
  switchExchange,
  buy,
  sell,
} from './reducer'
import CoinColumns from './components/CoinColumns'
import CoinPoloniex from './components/CoinPoloniex'
import CoinBittrex from './components/CoinBittrex'


const Home = props => (
  <div>
    {
      props.whichExchange == "bittrex"
      &&
      <div>
        <p>Based on data from the Bittrex exchange</p>
        <CoinColumns changeQuantityViews={props.changeQuantityViews} quantityViews={props.quantityViews}/>
        <div>
          {
            Object.keys(props.bittrex).sort( (a,b) => {
              if(a < b) return 1;
              if(a > b) return -1;
              return 0;
            }).map( (coinName, index) => {
              return <CoinBittrex key={`${coinName}-${index}`} changeQuantityViews={props.changeQuantityViews} quantityViews={props.quantityViews} name={coinName} values={props.bittrex[coinName].values}/>
            })
          }
        </div>
      </div>
    }
    {
      props.whichExchange == "poloniex"
      &&
      <div>
        <p>Based on data from the Poloniex exchange</p>
        <div className='columns columns-header'>
          <span className='row'>name</span>
          <span className='row'>last</span>
          <span className='row'>lowestAsk</span>
          <span className='row'>highestBid</span>
          <span className='row'>percentChange</span>
          <span className='row'>baseVolume</span>
          <span className='row'>quoteVolume</span>
        </div>
        <div>
          {
            Object.keys(props.poloniex).map( (coinName, index) => <CoinPoloniex key={`${coinName}-${index}`} name={coinName} values={props.poloniex[coinName]}/> )
          }
        </div>
      </div>
    }
  </div>
)

const mapStateToProps = state => ({
  whichExchange: state.homeReducer.whichExchange,
  quantityViews: state.homeReducer.quantityViews,
  bittrex: state.homeReducer.bittrex,
  poloniex: state.homeReducer.poloniex,
  buyAmount: state.homeReducer.buy.amount,
  sellAmount: state.homeReducer.sell.amount,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  switchExchange,
  changeQuantityViews,
  buy,
  sell,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)