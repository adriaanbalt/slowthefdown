const { gql } = require("apollo-server-express");

const typeDefs = gql`
	type Query {
		_: Boolean
		getUser(userId: ID!): User
		getHighscores(userId: ID!): [Highscore]
	}

	type Mutation {
		updateUser(userId: ID!, name: String!): User
		updateHighscore(userId: ID!, highscore: Int!): Highscore
	}

	type Highscore {
		filename: String!
		mimetype: String!
		encoding: String!
	}

	type User {
		id: ID!
		email: String!
		displayName: String
		highscore: Highscore
	}
`;

module.exports = typeDefs;
