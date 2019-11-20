const { ApolloError } = require('apollo-server-express')
const getUserById = require('../lib/getUserById')
module.exports = async (_, args) => {
    try {
        return getUserById(args.id)
    } catch (error) {
        throw new ApolloError(`Resolver Query user() ${error}`);
    }
}