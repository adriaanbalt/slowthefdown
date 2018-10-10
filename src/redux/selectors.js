
export function isAuthenticated(state) {
  return !!state.user.fbAccessToken;
}

export function profile(state) {
  return state.user.profile;
}

export function fbAccessToken(state) {
  return state.fbAccessToken;
}

export function users(state) {
  return state.users;
}

export function userById(state, userId) {
  return Object.values(users(state)).find(({ _id }) => _id === userId);
}

export function userHighscore(state) {
  return state.user.highscore;
}