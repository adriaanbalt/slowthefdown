import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import rootReducer from './reducers'
import createSocketIoMiddleware from 'redux-socket.io'
import io from 'socket.io-client'

let socketURL = __HEROKU__ == 'true' ? `https://sally-sells.herokuapp.com` : `http://localhost:5555`
console.log ( 'socketURL', __PORT__, socketURL )


let socket = io(socketURL);
let socketIoMiddleware = createSocketIoMiddleware(socket, "server/");

export const history = createHistory()

const initialState = {}
const enhancers = []
const middleware = [
  thunk,
  routerMiddleware(history),
  socketIoMiddleware
]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
)
// store.subscribe(()=>{
//   console.log('new client state', store.getState());
// });
// store.dispatch({type:'server/hello', data:'Hello!'});

export default store


// import { createStore, applyMiddleware } from 'redux';
// import createSocketIoMiddleware from 'redux-socket.io';
// import io from 'socket.io-client';
// let socket = io('http://localhost:3000');
// let socketIoMiddleware = createSocketIoMiddleware(socket, "server/");
// function reducer(state = {}, action){
//   switch(action.type){
//     case 'message':
//       return Object.assign({}, {message:action.data});
//     default:
//       return state;
//   }
// }
// let store = applyMiddleware(socketIoMiddleware)(createStore)(reducer);
// store.subscribe(()=>{
//   console.log('new client state', store.getState());
// });
// store.dispatch({type:'server/hello', data:'Hello!'});