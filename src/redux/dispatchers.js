import Expo from "expo";
const actions = require("./actions");
import store from "./store";
import * as SecureStore from "expo-secure-store";
import registerForPushNotifications from "../api/registerForPushNotifications";
import API from "../api";
import * as firebase from "firebase";
import FIREBASE_CONSTANTS from "../constants/firebase";
const FACEBOOK_APP_ID = "331867204038135";
const SECURE_STORE_FACEBOOK_TOKEN = "FACEBOOK_ACCESS_TOKEN";
const SECURE_STORE_FIRST_TIME = "FIRST_TIME";
const SECURE_STORE_HIGHSCORE = "SECURE_STORE_HIGHSCORE";

export default (dispatch) => () => {
	// used to set values to the reducer
	const set = (path, value) => {
		return dispatch(actions.set(path, value));
	};

	const initialize = () => {
		// Initialize Firebase
		if (!store.getState().initialized) {
			firebase.initializeApp(FIREBASE_CONSTANTS);
			set("/initialized", true);
		}

		// load as existing or new user
		// check if secure store has info?
		// check if server has info?
		// const firstTimeSecureStore = getUserFirstTimeSecureStore()
		// whatever the value of first time, set it to the reducer state for internal tracking
		// set("/user/firstime", firstTimeSecureStore);

		// check auth login state changes
		firebase.auth().onAuthStateChanged(async (user) => {
			if (user != null) {
				// since user exists, store user data in the reducer
				setUserDataLocal(user);

				// check if this is the user's first time in the App
				// getUserFirstTimeSecureStore()

				// get the user's local highscore to compare to the server highscore, take whatever is higher
				// server is what other users will see but secure store lets users play offline and keep their highscore...
				// if they play offline they will compete against themselves, but when they go online and they play their new highscore will in fact be updated online
				// TODO: add this updating online/offline to the ABOUT page
				const userHsFromSecureStore = await getSecureStoreHighScore();
				console.log(
					"firebase auth changed",
					typeof user,
					userHsFromSecureStore,
				);

				// get the current user"s highscore
				firebase
					.database()
					.ref("users/" + user.uid)
					.on("value", (snapshot) => {
						let hs = snapshot.val() && snapshot.val().highscore;
						if (!hs || hs < userHsFromSecureStore) {
							// if server highscore is less than secure store hardware highscore, choose the secure store hardware highscore
							hs = userHsFromSecureStore;
							// since server is not as high as local secure store, also update the server
							const user = firebase.auth().currentUser;
							firebase
								.database()
								.ref("users/" + user.uid)
								.update({
									highscore: hs,
								});
						}
						// set the highscore to whatever the server or secure store hardware value is
						setHighscore(hs);
					});
			}
			// Do other things
		});

		getHighscores();
	};

	const setUserDataLocal = (user) => {
		setUserToDb(user);
		set("/user/highscore", user.highscore);
		set("/user/email", user.email);
		set("/user/displayName", user.displayName);
		set("/user/lastLoginAt", Date.now());
		set("/user/phoneNumber", user.phoneNumber);
		set("/user/photoURL", user.photoURL);
	};

	const clearUserDataLocal = () => {
		// set("/user", {})
		set("/user/highscore", 0);
		set("/user/email", null);
		set("/user/displayName", null);
		set("/user/lastLoginAt", null);
		set("/user/phoneNumber", null);
		set("/user/photoURL", null);
		set("/user/fbAccessToken", null);
		SecureStore.setItemAsync(SECURE_STORE_HIGHSCORE, "0");
	};

	const setDeltaTime = (deltaTime) => set("/deltaTime", deltaTime);

	const fbAccessToken = () => store.getState().user.fbAccessToken;

	const getUserFirstTimeSecureStore = () => {
		return SecureStore.getItemAsync(SECURE_STORE_FIRST_TIME);
	};

	const setUserFirstTime = async (bool) => {
		let firstTime = await getUserFirstTime();
		if (firstTime || firstTime == undefined) {
			set("/user/firstime", bool);
			console.log("set user first time", firstTime);
			return SecureStore.setItemAsync(SECURE_STORE_FIRST_TIME, bool);
		}
	};

	const getHighscores = () => {
		// a promise is used here to create a loader
		return new Promise((resolve, reject) => {
			// get all users" highscores
			var query = firebase.database().ref("users");
			query.once("value").then((snapshot) => {
				let highscores = [];
				snapshot.forEach((childSnapshot) => {
					highscores.push(childSnapshot.val());
				});
				set("/highscores", highscores);
				resolve(highscores);
			});
		});
	};

	const getSecureStoreHighScore = () => {
		return SecureStore.getItemAsync(SECURE_STORE_HIGHSCORE).then((res) => {
			return res;
		});
	};

	const setUserHighscore = (score) => {
		const user = firebase.auth().currentUser;
		firebase
			.database()
			.ref("users/" + user.uid)
			.update({
				highscore: score,
			});
		set("/user/highscore", Number(score));
		set("/deltaTime", Number(score));
		SecureStore.setItemAsync(SECURE_STORE_HIGHSCORE, String(score));
	};

	const setHighscore = async (score) => {
		const user = firebase.auth().currentUser;
		const secureStoreHighscore = await getSecureStoreHighScore();
		const highscore =
			secureStoreHighscore || store.getState().user.highscore;

		console.log(
			"setHighscore() local || hardware = result",
			score,
			store.getState().user.highscore,
			secureStoreHighscore,
			highscore,
		);
		// if the user is defined
		// if the user"s highscore has never been set (aka is equal to undefined), then it should be set to the score
		// if the user"s highscore is less than the score sent, then it should be set to the score
		if (user != null && (highscore === undefined || highscore <= score)) {
			console.log("here");
			setUserHighscore(score);
		}
		getHighscores();
	};

	// update the DB user data (happens after each login to ensure redundancy)
	const setUserToDb = (user) => {
		firebase
			.database()
			.ref("users/" + user.uid)
			.update({
				displayName: user.displayName,
				lastLoginAt: Date.now(),
				email: user.email,
				photoURL: user.photoURL,
			});
	};

	const listenHighscoreByUser = (userId) => {
		API.listenHighscoreByUser(userId);
	};

	const setFacebookAccessToken = (token) => {
		if (token) {
			console.log("here?");
			return SecureStore.setItemAsync(
				SECURE_STORE_FACEBOOK_TOKEN,
				token,
			).then(() => {
				set("/user/fbAccessToken", token);
			});
		}
	};
	const getFacebookAccessToken = () => {
		return SecureStore.getItemAsync(SECURE_STORE_FACEBOOK_TOKEN);
	};
	const deleteUserAccount = () => {
		const user = firebase.auth().currentUser;
		if (user != null) {
			user.delete()
				.then((e) => {
					set("/user", null);
				})
				.catch((error) => {
					// An error happened.
					console.log("error deleting user");
				});
		}
	};
	const logout = () => {
		SecureStore.deleteItemAsync(SECURE_STORE_FACEBOOK_TOKEN).then(() => {
			console.log("done clearing local data ");
		});
		clearUserDataLocal();
		firebase.auth().signOut();
	};
	const signUp = async (email, password) => {
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.catch(function(error) {
				// Handle Errors here.
				// var errorCode = error.code;
				// var errorMessage = error.message;
			});
	};
	const login = async (email, password) => {
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.catch((error) => {
				console.log("scucess!");
				// var errorCode = error.code;
				// var errorMessage = error.message;
			});
	};
	const checkUserAccessToken = async () => {
		let accessToken = await getFacebookAccessToken();
		console.log("checkUserAccessToken", accessToken);
		if (accessToken) {
			set("/user/fbAccessToken", accessToken);
		}
	};

	return {
		initialize,
		set,
		signUp,
		login,
		logout,
		deleteUserAccount,
		checkUserAccessToken,
		getHighscores,
		setHighscore,
		setDeltaTime,
		listenHighscoreByUser,
	};
};
