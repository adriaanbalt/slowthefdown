const {gql} = require("apollo-server-express")

const typeDefs = gql`
  type Query {
    _: Boolean
    uploads: [File]
    getWorkById(id: ID!): Work
    getWorkByWorkIdUserId(workId: ID!, userId: ID!): Work
    user(id: String!): User
    getWorksByUserId(userId: ID!): [Work]
    getSoldWorksByUserId(userId: ID!): [Work]
    getOffersByUserId(userId: ID!): Transactions
  }

  type Mutation {
    offerWork(
      workId: ID!
      previousUserId: ID!
      nextUserId: ID!
      salePrice: Int!
      status: String!
    ): Transaction
    updateUser(userId: ID!, name: String!): User
    addWork(
      ownerId: ID! # current owner of the art
      artistId: ID! # create of the art
      uploaderId: ID! # person who uploaded the art (could be someone other than the artist)
      title: String!
      url: String
      year: String
      materials: String
      medium: String
      piece: String
      dimensions: String
      description: String
      personalizedId: String
      series: String
      editionName: String
      editionNumber: String
      editionId: String
    ): Work
    addImage(workId: ID!, title: String!, url: String!): Image
  }

  type Transactions {
    buying: [Work]
    selling: [Work]
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type User {
    id: ID!
    email: String!
    displayName: String
    avatarURL: String
    phoneNumber: String
    creationTime: Int
    lastSignInTime: Int
    ArtistProfileId: ID
    CollectorProfileId: ID
    DealerProfileId: ID
  }

  type Work {
    id: ID! # unique id
    ownerId: ID! # current owner
    artistId: ID! # user who created the art
    uploaderId: ID! # user who uploaded the art on behalf of an artist (could be the same as the artistId)
    artist: User!
    owner: User!
    dealer: User
    title: String!
    description: String
    yearProduced: String # when the work was created (could be a year or specific date)
    materials: String
    medium: String
    piece: String
    personalizedID: String
    price: Int
    url: String
    status: String
    edition: Edition
    dimensions: Dimensions
    transactions: [Transaction]
    createdDate: Int
    updatedDate: Int
  }

  type Entity {
    id: ID!
    title: String!
  }

  type Entity_Work {
    id: ID!
    workId: ID!
    entityId: ID!
  }

  type Entity_User {
    id: ID!
    userId: ID!
    entityId: ID!
  }

  type Transaction {
    id: ID!
    creationTime: String
    updateTime: String
    previousUserId: ID
    nextUserId: ID!
    workId: ID!
    salePrice: Int
    status: String
  }

  type Image {
    id: ID!
    workId: ID!
    url: String!
    title: String
  }

  type Dimensions {
    id: ID!
    width: Int
    height: Int
    depth: Int
    system: String
  }

  type Edition {
    id: ID!
    name: String
    number: Int
    customId: String
  }

  type Material {
    id: ID!
    type: String!
  }
`

module.exports = typeDefs
