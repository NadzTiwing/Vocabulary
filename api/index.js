//const express = require("express");
const { ApolloServer } = require("apollo-server");
const { typeDefs } = require("./schema/typeDefs");
const { resolvers } = require("./schema/resolvers");
const cors = require("cors");
const { UserList } = require("./fakeData");
//const app = express();
//CORS is needed to perform HTTP requests from another domain than your server domain to your server.
//Otherwise you may run into cross-origin resource sharing errors for your GraphQL server.
//app.use(cors());

// const schema = gql`
//   type Query {
//     me: User
//   }

//   type User {
//     username: String!
//   }
// `;
// const resolvers = {
//   Query: {
//     me: () => {
//       return {
//         username: "Robin Wieruch",
//       };
//     },
//   },
// };

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
server.listen().then((res) => {
  console.log("Apollo Server on http://localhost:8000/graphql");
});
// server.start().then((res) => {
//   server.applyMiddleware({ app, path: "/graphql" });
//   app.listen({ port: 8000 }, () => {
//     console.log("Apollo Server on http://localhost:8000/graphql");
//   });
// });
