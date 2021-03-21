var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using graphql schema language
var schema = buildSchema(
    `type Query{
        getdata: String
    }`,
);

var root = {
    getdata: () => {
        return 'Hello World!';
    },
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');