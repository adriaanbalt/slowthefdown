import React from "react";
import AppNavigator from "./navigation/AppNavigator5x";
import BannerAd from "./shared/BannerAd";
import Modal from "./shared/Modal";
import React, { useReducer } from "react";
import { AppContext, getInitAppState } from "./Context";

/**
 * Function that reduces any function
 */
function reducer(prevState, action) {
	if ("doAction" in action) {
		// pass prevState and action to `doAction` dispatch function
		action.doAction(prevState, action);

		return { ...prevState }; //must copy to cause rerender
	} else {
		throw new Error(`Action missing doAction: ${JSON.stringify(action)}`);
	}
}

export default function App() {
	// This is the global appState and global dispatch function.
	// We use AppContext.Provider to pass these to all screens
	let [appState, dispatch] = useReducer(reducer, getInitAppState());

	let appContext = {
		appState: appState,
		dispatch: dispatch,
	};

	return (
		<AppContext.Provider value={appContext}>
			<Modal />
			<AppNavigator />
			<BannerAd />
		</AppContext.Provider>
	);
}
