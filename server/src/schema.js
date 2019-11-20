const { gql } = require("apollo-server-express");

const typeDefs = gql`
	type Query {
		_: Boolean
		getUser(userId: ID!): User
		getHighscores(userId: ID!): [Highscore]
	}

	type Mutation {
		updateUser(userId: ID!, name: String!): User
	}

	type Highscore {
		id: ID
		value: Int!
		userID: ID!
	}

	type User {
		id: ID!
		email: String!
		displayName: String!
		highscore: Highscore!
		highscoreID: ID
	}
`;

module.exports = typeDefs;
