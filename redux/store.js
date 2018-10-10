import { createStore } from 'redux';

import {
  SET
} from './actions';

const defaultState = {
  authenticatedUser: null,
  accessToken: null,
  user: {},
  users: {},
};

function handleSetAction(state, action) {
  const { path, value } = action.value;

  if (path === '/user/fbAccessToken') {
    return {
      ...state,
      user: {
        ...state.user,
        fbAccessToken: value
      }
    };
  }

  if (path === '/user/profile') {
    return {
      ...state,
      user: {
        ...state.user,
        profile: value
      }
    };
  }

  for (const key of ['users']) {
    if (path.indexOf(`/${key}/`) === 0) {
      const id = path.slice(`/${key}/`.length);
      return {
        ...state,
        [key]: {
          ...(state[key] || {}),
          [id]: value
        }
      };
    }
  }

  console.log('Was not successful in updating state: ' + path);

  return state;
}

function counter(state = defaultState, action) {
  switch (action.type) {
  case SET:
    return handleSetAction(state, action);
  default:
    return state;
  }
}

export default createStore(counter, defaultState);
