const admin = require("firebase-admin");
module.exports = (userId) => {
	return admin
		.firestore()
		.doc(`users/${userId}`)
		.get()
		.then((doc) => {
			if (doc.exists) {
				return doc.data();
			} else {
				return new ValidationError("User does not exist");
			}
		})
		.catch((err) =>
			console.log("[Query user] Error getting user document", err),
		);
};
