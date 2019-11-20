const { ApolloError, ValidationError } = require("apollo-server-express");
const objectAssignDeep = require("object-assign-deep");
const updateHighscore = require("../lib/updateHighscore");
module.exports = async (_, data) => {
	try {
		// change user properties for the work
		const newWorkProperties = {
			ownerId: data.nextUserId,
		};
		await updateHighscore(data.workId, newWorkProperties);

		return objectAssignDeep({}, { id: newDbObjId }, data);
	} catch (error) {
		throw new ApolloError(`Resolver Mutation TransferWork() ${error}`);
	}
};
