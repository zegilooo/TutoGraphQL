'use strict';

const {reduce, noop} = require('lodash');

/**
 * Build graphQL fields for an GraphQLObject, using noop as default resolver
 * @param {object} schema: map of an GraphQLFieldType
 * @param {object} overloadedSchema: map of GraphQLFieldType to overload current schema
 * @param {boolean} useDefaultResolver: if true, use built in identity resolver
 * @return {object}
 */
module.exports = (schema, overloadedSchema, useDefaultResolver = false) => reduce(schema, // for each field
    (acc, field, key) => {
        const fieldOverload = Object.assign({}, overloadedSchema[key], {
            // and assigning the resolver. if resolversList for that field key is defined we pick it
            // otherwise setting noop to it.
            resolve: !!overloadedSchema[key] ? overloadedSchema[key].resolve : noop
        });

        if (useDefaultResolver && fieldOverload.resolve === noop) {
            delete fieldOverload.resolve;
        }

        // pick the type definition
        acc[key] = Object.assign({}, field, fieldOverload);

        return acc;
    }, {}
);