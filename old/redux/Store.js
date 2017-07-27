import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import RootReducer from './Reducers';

export function configureStore(initialState) {

  let finalCreateStore;

  if (process.env.NODE_ENV === 'production') {
    finalCreateStore = applyMiddleware(thunk)(createStore);
  } else {
    finalCreateStore = compose(
      applyMiddleware(thunk),
    )(createStore);
  }

  const store = finalCreateStore(RootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for Reducers
    module.hot.accept('./Reducers', () => {
      const nextReducer = require('./Reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
