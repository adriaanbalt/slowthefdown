import React from "react";

let initAppState = {
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

let initAppStateString = JSON.stringify(initAppState);

function getInitAppState() {
	// Deep copy to prevent local mutation
	return JSON.parse(initAppStateString);
}

// Ony global app context
let AppContext = React.createContext();

module.exports = {
	AppContext,
	getInitAppState,
};
