import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import Constants from "expo-constants";

const config = Constants.manifest.extra.firebase;

export default !firebase.apps.length
	? firebase.initializeApp(config)
	: firebase.app();
