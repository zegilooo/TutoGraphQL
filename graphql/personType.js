const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLInterfaceType
} = require('graphql');

const buildGraphQLFields  = require('./buildGraphQLFields');

const fields = {
  firstName: {type: GraphQLString},
  lastName:  {type: GraphQLString},
  age:       {type: GraphQLInt},
  id:        {type: GraphQLInt}
}

const InterfacePerson = new GraphQLInterfaceType({
  name:     'Person',
  fields
});

const MePerson = new GraphQLObjectType({
  name:     'MePerson',
  interfaces: [ InterfacePerson ],
  fields: buildGraphQLFields(fields, {
    firstName: {type: GraphQLString},
    lastName:  {type: GraphQLString},
    age:       {type: GraphQLInt}
  }),
  isTypeOf: person => person.age
});

const WDPerson = new GraphQLObjectType({
  name:     'WDPerson',
  interfaces: [ InterfacePerson ],
  fields: buildGraphQLFields(fields, {
    firstName: {type: GraphQLString},
    lastName:  {type: GraphQLString},
    id:        {type: GraphQLInt}
  }),
  isTypeOf: person => !person.uuid
});

const GoTPerson = new GraphQLObjectType({
  name:     'GoTPerson',
  interfaces: [ InterfacePerson ],
  fields: buildGraphQLFields(fields, {
    firstName: {
        type: GraphQLString,
        resolve: person => person.name
    },
    lastName:  {
        type: GraphQLString,
        resolve: person => person.givenName
    },
    id:        {
        type: GraphQLInt,
        resolve: person => person.uuid
    }
  }),
  isTypeOf: person => !person.firstName
});

module.exports = {
  InterfacePerson,
  MePerson,
  WDPerson,
  GoTPerson
};