/* firebase cloud functions */

const configureServer = require(`./server`)
const functions = require('firebase-functions')
// Firebase Setup
const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')
const objectAssignDeep = require('object-assign-deep');

const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
})

const server = configureServer(firebaseApp)
const api = functions.https.onRequest(server)
// when new files are uploaded into the cloud storage this function is called
// it grabs the name of the asset that was uploaded and confirms it was uploaded
// was thinking this could be usef for 
const storageOnChange = functions.storage.object().onFinalize( async object => {
    console.log('storage on change!', object.name)
}) 

// On sign up.
const processSignUp = functions.auth.user().onCreate(user => {
    const newUserObj = {
        id: user.uid,
        email: user.email,
        // displayName: user.displayName,
        // photoURL: user.photoURL,
        // phoneNumber: user.phoneNumber,
        creationTime: user.metadata.creationTime,
        // lastSignInTime: user.lastSignInTime,
    }
    console.log("PROCESS SIGN UP newUserObj", newUserObj)

    return admin
        .firestore()
        .collection('users')
        .doc(user.uid)
        .set(newUserObj)
        .then(writeResult => {
            console.log('User Created result:', writeResult);
            return;
        })
        .catch(err => {
            console.log(err);
            return;
        });
})

// const registerWork = function.firestore.

module.exports = { api, processSignUp, storageOnChange }