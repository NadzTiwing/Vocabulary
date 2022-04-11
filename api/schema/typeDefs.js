const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    password: String!
  }

  type Query {
    users: [User!]!
  }
`;

module.exports = { typeDefs };
