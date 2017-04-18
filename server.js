const express     = require('express');
const graphqlHTTP = require('express-graphql');

const schema      = require('./graphql/schema');

const app         = express();

const port        = process.env.PORT || 3000;

  app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(port, function () {
    console.log(`app listening on port ${port}!`);
});
