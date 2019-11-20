// mutations
const updateUser = require("./mutations/updateUser");
const updateHighscore = require("./mutations/updateHighscore");

// queries
const getUser = require("./queries/getUser");
const getHighscores = require("./queries/getHighscores");

module.exports = {
	Query: {
		getUser,
		getHighscores,
	},
	Mutation: {
		updateUser,
		updateHighscore,
	},
};
