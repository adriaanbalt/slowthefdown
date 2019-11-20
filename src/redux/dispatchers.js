import Expo from "expo";
const actions = require("./actions");
import store from "./store";
import * as SecureStore from "expo-secure-store";
import registerForPushNotifications from "../api/registerForPushNotifications";
import * as firebase from "firebase";
import FIREBASE_CONSTANTS from "../constants/firebase";
const FACEBOOK_APP_ID = "331867204038135";
const SECURE_STORE_USER_UID = "ACCESS_TOKEN";
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
							updateUserOnDb({
								uid: user.uid,
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
		console.log("setUserDataLocal", user.highscore);
		updateUserOnDb({
			uid: user.uid,
			lastLoginAt: Date.now(),
		});
		set("/user/highscore", user.highscore);
		set("/user/email", user.email);
		set("/user/displayName", user.displayName);
		set("/user/lastLoginAt", Date.now());
		setUserUid(user.uid);
		firebase
			.database()
			.ref("users/" + user.uid)
			.on("value", (snapshot) => {
				set("/user/displayName", snapshot.val().displayName);
			});
	};

	const clearUserDataLocal = () => {
		// set("/user", {})
		set("/user/highscore", 0);
		set("/user/email", null);
		set("/user/displayName", null);
		set("/user/lastLoginAt", null);
		set("/user/phoneNumber", null);
		set("/user/photoURL", null);
		set("/user/uid", null);
		SecureStore.setItemAsync(SECURE_STORE_HIGHSCORE, "0");
	};

	const setDeltaTime = (deltaTime) => set("/deltaTime", deltaTime);

	const getUserFirstTimeSecureStore = () => {
		return SecureStore.getItemAsync(SECURE_STORE_FIRST_TIME);
	};

	const setUserFirstTime = async (bool) => {
		let firstTime = await getUserFirstTime();
		if (firstTime || firstTime == undefined) {
			set("/user/firstime", bool);
			return SecureStore.setItemAsync(SECURE_STORE_FIRST_TIME, bool);
		}
	};

	const getHighscores = () => {
		// a promise is used here to create a loader
		return new Promise((resolve, reject) => {
			// get all users" highscores
			var query = firebase.database().ref("users");
			query
				.orderByChild("highscore")
				.limitToLast(10)
				.on("value", (snapshot) => {
					let highscores = [];
					snapshot.forEach((childSnapshot) => {
						highscores.push(childSnapshot.val());
					});
					set("/highscores", highscores);
					resolve(highscores);
				});
			// query
			// 	.orderByChild("highscore")
			// 	.on("value")
			// 	.then((snapshot) => {
			// 		let highscores = [];
			// 		snapshot.forEach((childSnapshot) => {
			// 			highscores.push(childSnapshot.val());
			// 		});
			// 		set("/highscores", highscores);
			// 		resolve(highscores);
			// 	});
		});
	};

	const getSecureStoreHighScore = () => {
		return SecureStore.getItemAsync(SECURE_STORE_HIGHSCORE).then((res) => {
			return res;
		});
	};

	const setUserHighscore = (score) => {
		const user = firebase.auth().currentUser;
		updateUserOnDb({
			uid: user.uid,
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
		// if the user is defined
		// if the user"s highscore has never been set (aka is equal to undefined), then it should be set to the score
		// if the user"s highscore is less than the score sent, then it should be set to the score
		if (user != null && (highscore === undefined || highscore <= score)) {
			setUserHighscore(score);
		}
		getHighscores();
	};

	// update the DB user data (happens after each login to ensure redundancy)
	const updateUserOnDb = (obj) => {
		firebase
			.database()
			.ref("users/" + obj.uid)
			.update(obj);
	};

	const setUserUid = (token) => {
		if (token) {
			return SecureStore.setItemAsync(SECURE_STORE_USER_UID, token).then(
				() => {
					set("/user/uid", token);
				},
			);
		}
	};
	const getUserUid = () => {
		return SecureStore.getItemAsync(SECURE_STORE_USER_UID);
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
		SecureStore.deleteItemAsync(SECURE_STORE_USER_UID).then(() => {
			console.log("done clearing local data ");
		});
		clearUserDataLocal();
		firebase.auth().signOut();
	};
	const signUp = async (email, password, displayName) => {
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(
				({ user }) => {
					updateUserOnDb({
						uid: user.uid,
						displayName: displayName,
						created: Date.now(),
						email: user.email,
					});
				},
				(error) => {
					console.log("ERROR");
				},
			);
	};
	const login = async (email, password) => {
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.catch((error) => {
				// var errorCode = error.code;
				// var errorMessage = error.message;
			});
	};
	const checkUserUid = async () => {
		let uid = await getUserUid();
		if (uid) {
			set("/user/uid", uid);
		}
	};

	return {
		initialize,
		set,
		signUp,
		login,
		logout,
		deleteUserAccount,
		checkUserUid,
		getHighscores,
		setHighscore,
		setDeltaTime,
	};
};
