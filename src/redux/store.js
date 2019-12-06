import { createStore } from "redux";

import { SET } from "./actions";

const defaultState = {
	ui: {
		modal: {
			children: null,
		},
	},
	initialized: false,
	authenticatedUser: null,
	accessToken: null,
	user: {
		highscore: 0,
	},
	users: {},
	highscores: [],
	deltaTime: 0,
	ad: {
		interstitial: false,
	},
	levels: [
		{
			name: "particles",
			type: "ParticlesLevel",
			duration: 20000,
		},
		{
			name: "particles",
			type: "ParticlesLevelGreen",
			duration: 20000,
		},
		{
			name: "vortex",
			type: "VortexLevel",
			duration: 20000,
		},
	],
};

function handleSetAction(state, action) {
	const { path, value } = action.value;

	if (path === "/user") {
		return {
			...state,
			user: value,
		};
	}

	if (path === "/user/fbAccessToken") {
		return {
			...state,
			user: {
				...state.user,
				fbAccessToken: value,
			},
		};
	}

	if (path === "/user/profile") {
		return {
			...state,
			user: {
				...state.user,
				profile: value,
			},
		};
	}

	if (path === "/deltaTime") {
		return {
			...state,
			deltaTime: value,
		};
	}

	if (path === "/highscores") {
		return {
			...state,
			highscores: value,
		};
	}

	if (path === "/modal") {
		return {
			...state,
			ui: {
				...state.ui,
				modal: action,
			},
		};
	}

	for (const key of ["user"]) {
		if (path.indexOf(`/${key}/`) === 0) {
			const id = path.slice(`/${key}/`.length);
			return {
				...state,
				[key]: {
					...(state[key] || {}),
					[id]: value,
				},
			};
		}
	}

	for (const key of ["ad"]) {
		if (path.indexOf(`/${key}/`) === 0) {
			const id = path.slice(`/${key}/`.length);
			return {
				...state,
				[key]: {
					...(state[key] || {}),
					[id]: value,
				},
			};
		}
	}

	console.log("Was not successful in updating state: " + path);

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
