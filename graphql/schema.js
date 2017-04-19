const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLInt,
    GraphQLString
} = require('graphql');

const _ = require('lodash');

const {
  InterfacePerson,
  MePerson,
  WDPerson,
  GoTPerson }  = require('../graphql/personType');

const WDPeople    = require('../data/WDPeople.json');
const GoTPeople  = require('../data/GoTPeople.json');
const me = require('../data/me');

const fullData = WDPeople.persons.concat(GoTPeople);

fullData.push(me);

const personResolver =  (root, args) => {
  if (!!args.id) {
    const foundById = _.find(fullData, {id: args.id});
    if(!!foundById) return foundById;
    const foundByUuid = _.find(fullData, {uuid: args.id});
    if(!!foundByUuid) return foundByUuid;
    return _.noop;
  }
  else if (!!args.firstName){
    const foundByFirstName = _.find(fullData, {firstName: args.firstName});
    if(!!foundByFirstName) return foundByFirstName;
    const foundByName = _.find(fullData, {name: args.firstName});
    if(!!foundByName) return foundByName;
    return _.noop;
  }
};

const personsResolver =  (root, args) => {
  if (!!args.lastName){
    const foundByLastName = _.filter(fullData, {lastName: args.lastName});
    const foundByGivenName = _.filter(fullData, {givenName: args.lastName});
    return foundByLastName.concat(foundByGivenName);
  }
  if(!!args.thisOperatorForIds && !!args.than){
    if(['<','>'].includes(args.thisOperatorForIds) && Number.isInteger(args.than)){
      const foundById =_.filter(fullData, args.thisOperatorForIds === '<' ? (o) => o.id < args.than : (o) => o.id > args.than);
      const foundByUuid =_.filter(fullData, args.thisOperatorForIds === '<' ? (o) => o.uuid < args.than : (o) => o.uuid > args.than);
      return foundById.concat(foundByUuid);
    }
  }
  if(!!args.age) return _.filter(fullData, {age: args.age});
  return fullData;
};

console.log(fullData);

module.exports = new GraphQLSchema({
    types: [MePerson, WDPerson, GoTPerson],
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            me: {
                type:    InterfacePerson,
                resolve: () => require('../data/me')
            },
            persons: {
                type:    new GraphQLList(InterfacePerson),
                args:{
                  lastName:           {type: GraphQLString},
                  thisOperatorForIds: {type: GraphQLString},
                  than:               {type: GraphQLInt},
                  age:               {type: GraphQLInt}
                },
                resolve: personsResolver
            },
            person: {
                type: InterfacePerson,
                args: {
                    id:         {type: GraphQLInt},
                    firstName:  {type: GraphQLString}
                },
                resolve: personResolver
            }
        }
    })
});
