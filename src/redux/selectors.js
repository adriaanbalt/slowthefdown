export function isAuthenticated(state) {
	return !!state.user.uid;
}

export function getPropertyFromState(state, property) {
	return state[property];
}

export function profile(state) {
	return state.user;
}

export function uid(state) {
	return state.uid;
}

export function users(state) {
	return state.users;
}

export function userById(state, userId) {
	return Object.values(users(state)).find(({ _id }) => _id === userId);
}

export function getCurrentUserHighscore(state) {
	return state.user && state.user.highscore;
}

export function getDeltaTime(state) {
	return state.deltaTime;
}

export function highscores(state) {
	return state.highscores;
}

export function getLevels(state) {
	return state.levels;
}
