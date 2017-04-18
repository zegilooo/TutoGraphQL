const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const _ = require ('lodash');

const personType = require('../graphql/personType');
const personsArray = require('../data/persons.json').persons;

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            me: {
                type:    personType,
                resolve: () => require('../data/me')
            },
            persons: {
                type:    new GraphQLList(personType),
                description: 'List of persons',
                resolve: () => personsArray
            },
            person: {
                type:    personType,
                  args: {
                      id: {
                          name: 'id',
                          type: new GraphQLNonNull(GraphQLInt)
                      }
                  },
                  resolve: (root, {id}) => _.find(personsArray, person => person.id === id)

            }
        }
    })
});
