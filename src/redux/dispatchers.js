import Expo from "expo";
import * as Updates from "expo-updates";
const actions = require("./actions");
import store from "./store";
import * as SecureStore from "expo-secure-store";
// import * as firebase from "firebase";
import firebase from "../constants/firebase";
import { AdMobInterstitial } from "expo-ads-admob";
import AdMob from "../constants/AdMob";
import FIREBASE_CONSTANTS from "../constants/firebase";
const SECURE_STORE_USER_UID = "ACCESS_TOKEN";
const SECURE_STORE_HIGHSCORE = "SECURE_STORE_HIGHSCORE";
const SECURE_STORE_FIRST_TIME = "SECURE_STORE_FIRST_TIME";

export default (dispatch) => () => {
	// used to set values to the reducer
	const set = (path, value) => {
		return dispatch(actions.set(path, value));
	};

	const initialize = async () => {
		// Initialize Firebase
		// if (!store.getState().initialized) {
		// 	firebase.initializeApp(FIREBASE_CONSTANTS);
		// 	set("/initialized", true);
		// }

		AdMobInterstitial.setAdUnitID(AdMob.interstitial); // Test ID, Replace with your-admob-unit-id
		// AdMobInterstitial.setTestDeviceID('EMULATOR');
		AdMobInterstitial.addEventListener("interstitialDidOpen", () =>
			console.log("interstitialDidOpen"),
		);
		AdMobInterstitial.addEventListener("interstitialDidClose", () => {
			console.log("interstitialDidClose");
			set("/ad/interstitial", false);
		});

		// load as existing or new user
		// check if secure store has info?
		// check if server has info?

		// check auth login state changes
		firebase.auth().onAuthStateChanged(async (user) => {
			// console.log("!!onAuthStateChanged", user != null);
			if (user != null) {
				// get the user's local highscore to compare to the server highscore, take whatever is higher
				// server is what other users will see but secure store lets users play offline and keep their highscore...
				// if they play offline they will compete against themselves, but when they go online and they play their new highscore will in fact be updated online
				// TODO: add this updating online/offline to the ABOUT page
				const userHsFromSecureStore = await getSecureStoreHighScore();

				// get the current user"s highscore
				firebase
					.database()
					.ref("users/" + user.uid)
					.once("value", (snapshot) => {
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
						setUserHighscore(hs);
					});

				// since user exists, store user data in the reducer

				setUserDataLocal(user);
			} else {
				const hs = await getSecureStoreHighScore();
				setUserHighscore(hs);
			}
			// Do other things
		});

		getHighscores();
	};

	const toggleModal = (action) => {
		set("/modal", action);
	};

	const setSecureStoreUser = (user) => {
		setUserUid(user.uid);
		// set highscore and set
	};

	const ifMattImo = (user) => {
		return (
			user.uid === "BrO8J19gjHThGGpGy1jEKRsKrsf2" ||
			user.uid === "v0aCvGqgNzeivCeVk3Ain5NZ6WM2"
		);
	};

	const setUserDataLocal = async (user) => {
		updateUserOnDb({
			uid: user.uid,
			lastLoginAt: Date.now(),
		});
		set("/user/email", user.email);
		set("/user/lastLoginAt", Date.now());
		setSecureStoreUser(user);
		const ref = firebase
			.database()
			.ref("/users/" + user.uid)
			.once("value")
			.then((snapshot) => {
				set("/user/displayName", snapshot.val().displayName);
			});
		const hs = await getSecureStoreHighScore();
		set("/user/highscore", hs);
	};

	const clearUserDataLocal = () => {
		// set("/user", {})
		set("/user/highscore", 0);
		set("/deltaTime", 0);
		set("/user/email", null);
		set("/user/displayName", null);
		set("/user/lastLoginAt", null);
		set("/user/phoneNumber", null);
		set("/user/photoURL", null);
		set("/user/uid", null);
		SecureStore.setItemAsync(SECURE_STORE_HIGHSCORE, "0");
	};

	const setDeltaTime = (deltaTime) => set("/deltaTime", deltaTime);

	const getHighscores = () => {
		// a promise is used here to create a loader
		return new Promise((resolve, reject) => {
			// get all users" highscores
			var query = firebase.database().ref("users");
			query.orderByChild("highscore").on("value", (snapshot) => {
				let highscores = [];
				snapshot.forEach((childSnapshot) => {
					highscores.push(childSnapshot.val());
				});
				set("/highscores", highscores);
				resolve(highscores);
			});
		});
	};

	const getSecureStoreHighScore = async () => {
		const ret = await SecureStore.getItemAsync(SECURE_STORE_HIGHSCORE).then(
			(res) => {
				return Number(res) || 0;
			},
		);
		return ret;
	};

	const setUserHighscore = async (score) => {
		const user = firebase.auth().currentUser;
		if (user && user.uid) {
			updateUserOnDb({
				uid: user.uid,
				highscore: score,
			});
		}
		set("/user/highscore", Number(score));
		SecureStore.setItemAsync(SECURE_STORE_HIGHSCORE, String(score));
		const secureStoreHighscore = await getSecureStoreHighScore();
	};

	const setHighscore = async (score) => {
		const user = firebase.auth().currentUser;
		const secureStoreHighscore = await getSecureStoreHighScore();
		const highscore =
			secureStoreHighscore || store.getState().user.highscore;
		// if the user is defined
		// if the user"s highscore has never been set (aka is equal to undefined), then it should be set to the score
		// if the user"s highscore is less than the score sent, then it should be set to the score
		if (highscore === undefined || highscore <= score) {
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

	const setFirstTime = () => {
		return SecureStore.setItemAsync(SECURE_STORE_FIRST_TIME, false).then(
			() => {
				set("/user/firsttime", false);
			},
		);
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
		// firebase.auth().signOut();
	};
	const signUp = (email, password, displayName) => {
		// firebase
		// 	.auth()
		// 	.createUserWithEmailAndPassword(email, password)
		// 	.then(
		// 		({ user }) => {
		// 			updateUserOnDb({
		// 				uid: user.uid,
		// 				displayName: displayName,
		// 				created: Date.now(),
		// 				email: user.email,
		// 				highscore: 0 || store.getState().deltaTime,
		// 			});
		// 		},
		// 		(error) => {
		// 			console.log("ERROR");
		// 		},
		// 	);
	};
	const login = (email, password) => {
		// return firebase
		// 	.auth()
		// 	.signInWithEmailAndPassword(email, password)
		// 	.catch((error) => error);
	};
	const checkUserUid = async () => {
		let uid = await getUserUid();
		if (uid) {
			set("/user/uid", uid);
		}
	};

	const showInterstitial = () => {
		if (!store.getState().ad.interstitial) {
			set("/ad/interstitial", true);
			AdMobInterstitial.requestAdAsync({
				servePersonalizedAds: true,
			});
			AdMobInterstitial.showAdAsync();
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
		showInterstitial,
		toggleModal,
	};
};
