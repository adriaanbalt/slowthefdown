const { ApolloError } = require("apollo-server-express");
const admin = require("firebase-admin");
module.exports = async (_, data) => {
	try {
		const newObj = {
			displayName: data.name,
			updatedDate: Date.now(),
		};
		await admin
			.firestore()
			.doc(`users/${data.userId}`)
			.update(newObj)
			.then((docRef) => {
				console.log("User Document successfully updated!");
				return;
			})
			.catch((error) => {
				console.error(
					"[UpdateUser] Error updating user document: ",
					error,
				);
			});

		return await admin
			.firestore()
			.doc(`users/${data.userId}`)
			.get(newObj)
			.then((docRef) => {
				console.log("User Document information!", docRef.data());
				return docRef.data();
			})
			.catch((error) => {
				console.error(
					"[UpdateUser] Error updating user document: ",
					error,
				);
			});
	} catch (error) {
		throw new ApolloError(`Resolver Query UpdateUser() ${error}`);
	}
};
