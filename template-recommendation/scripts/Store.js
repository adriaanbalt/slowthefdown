import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import QueueReducer from './shared/Queue/reducer'
import CollectedDataReducer from './shared/CollectedDataStore/reducer'
import analyticsMiddleware from './middleware/analyticsMiddleware'

export const history = createHistory()

const combinedReducers = combineReducers({
  QueueReducer,
  CollectedDataReducer,
})

const initialState = {}
const enhancers = []
const middleware = [
  thunk,
  routerMiddleware( history ),
  analyticsMiddleware
]

// Enable redux dev tools in development
if ( process.env.NODE_ENV !== 'production' ) {
  const devToolsExtension = window.devToolsExtension

  if ( typeof devToolsExtension === 'function' ) {
    enhancers.push( devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware( ...middleware ),
  ...enhancers
)

const store = createStore(
  combinedReducers,
  initialState,
  composedEnhancers
)

export default store
