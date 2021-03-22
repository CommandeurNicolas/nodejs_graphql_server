const port = process.env.PORT || 4000;

const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const serviceAccount = require("./serviceKey.json");
const admin = require("firebase-admin");
const functions = require('firebase-functions')
const { ApolloServer, gql } = require("apollo-server-express")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://marketplace-1fbc0-default-rtdb.firebaseio.com/"
});

const typeDefs = gql`
    type Product {
        name: String
        price: String
        weight: String
    }
    type Query {
        products: [Product]
    }
`

const resolvers = {
    Query: {
      products: () => {
        return admin.database()
        .ref("products")
        .once("value")
        .then((snap) => snap
          .val())
          .then((val) => Object
            .keys(val)
            .map ((key) => val[key]));
          },
        },
      };

const app = express()
const server = new ApolloServer({typeDefs, resolvers})

server.applyMiddleware({app, path: "/graphql", cors: true})

exports.graphql = functions.https.onRequest(app)

app.use('/graphql', graphqlHTTP({
    schema: typeDefs,
    graphiql: true,
}));
app.listen(port);
console.log(`Running a GraphQL API server at http://localhost:${port}/graphql`);