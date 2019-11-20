import gql from "graphql-tag";

export const GET_USER = gql`
	query GetUser($userId: ID!) {
		getUser(userId: $userId) {
			id
			displayName
			email
			highscore
		}
	}
`;

export const GET_HIGHSCORES = gql`
	query GetHighscores($userId: ID!) {
		getHighscores(userId: $userId) {
			value
			userID
		}
	}
`;

export const UPDATE_USER = gql`
	mutation UpdateUser(
		$userId: ID!
		$email: String
		$name: String
		$highscore: Int
	) {
		updateUser(
			userId: $userId
			email: $email
			name: $name
			highscore: $highscore
		) {
			id
			displayName
			email
			highscore
		}
	}
`;
