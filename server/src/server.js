const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const schema = require("./schema");
const resolvers = require("./resolvers");

function configureServer() {
	// invoke express to create our server
	const app = express();
	// cors allows our server to accept requests from different origins
	app.use(cors());
	app.options("*", cors());
	// setup server
	const server = new ApolloServer({
		typeDefs: schema,
		resolvers,
		introspection: true, // so we can access the playground in production reference: https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructor-options-lt-ApolloServer-gt
		playground: true,
		engine: {
			debugPrintReports: true,
		},
	});

	// now we take our newly instantiated ApolloServer and apply the   // previously configured express application
	server.applyMiddleware({ app, path: "/", cors: true });
	// finally return the application
	return app;
}

module.exports = configureServer;
