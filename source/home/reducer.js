export const SWITCH_EXCHANGE = 'SWITCH_EXCHANGE'
export const CHANGE_QUANTITY_VIEW = 'CHANGE_QUANTITY_VIEW'
export const BITTREX = 'BITTREX'
export const POLONIEX = 'POLONIEX'
export const SELL = 'SELL'
export const BUY = 'BUY'

const initialState = {
  whichExchange: 'bittrex',
  bittrex: [],
  poloniex: [],
  quantityViews: {
    current: "ask",
    views: [
      "ask",
      "basevolume",
      "bid",
      "high",
      "last",
      "low",
      "openbuyorders",
      "opensellorders",
      "volume",
    ]
  },
  buy: {
    amount: 0,
    conversion: ""
  },
  sell: {
    amount: 0,
    conversion: ""
  },
}

export default (state = initialState, action) => {
  switch (action.type) {

    case SWITCH_EXCHANGE:
      return {
        ...state,
        whichExchange: action.whichExchange
      }

    case CHANGE_QUANTITY_VIEW:
      return {
        ...state,
        quantityViews: {
          ...state.quantityViews,
          current: action.currentQuantityView
        }
      }

    case BITTREX:
      return {
        ...state,
        bittrex:{
          ...state.bittrex,
          [action.data.coin]:action.data
        }
      }

    case POLONIEX:
      return {
        ...state,
        poloniex:{
          ...state.poloniex,
          [action.data.coin]:action.data.values
        }
      }

    case BUY:
      return {
        ...state,
        buy: {
          amount: action.amount,
          conversion: action.conversion
        }
      }


    case SELL:
      return {
        ...state,
        sell: {
          amount: action.amount,
          conversion: action.conversion
        }
      }

    default:
      return state
  }
}


export const buy = ( amount, type ) => {
  return dispatch => {
    dispatch({
      type: BUY,
      amount,
      conversion
    })
  }
}

export const sell = () => {
  return dispatch => {
    dispatch({
      type: SELL,
      amount,
      conversion
    })
  }
}

export const switchExchange = ( newExchange ) => {
  return dispatch => {
    dispatch({
      type: SWITCH_EXCHANGE,
      whichExchange: newExchange
    })
  }
}

export const changeQuantityViews = () => {
  return (dispatch, getState) => {
    const homeReducer = getState().homeReducer;
    console.log ('homeReducer', homeReducer.quantityViews)
    // TODO > handle the quantity view manipulation
    const previousQuantityView = homeReducer.quantityViews.current
    let currentQuantityViewIndex = 0
    homeReducer.quantityViews.views.map( (item, index) => {
      if ( item == previousQuantityView ) {
        currentQuantityViewIndex = index+1
        return
      }
    })
    if ( currentQuantityViewIndex > homeReducer.quantityViews.views.length-1 ) {
      currentQuantityViewIndex = 0;
    }
    console.log ('changeQuantityViews', currentQuantityViewIndex )
    dispatch({
      type: CHANGE_QUANTITY_VIEW,
      currentQuantityView: homeReducer.quantityViews.views[currentQuantityViewIndex]
    })
  }
}
