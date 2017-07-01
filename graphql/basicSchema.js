import {
	GraphQLBoolean,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString,
	GraphQLEnumType,
} from 'graphql';

var keystoneTypes = require('./keystoneTypes');

var keystone = require('keystone');
var User = keystone.list('User');

var userType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: { type: new GraphQLNonNull(GraphQLID) },
		name: { type: new GraphQLNonNull(keystoneTypes.name) },
		// email: {
		// 	type: keystoneTypes.email,
		// 	resolve: (source) => ({
		// 		email: source.email,
		// 		gravatarUrl: source._.email.gravatarUrl,
		// 	}),
		// },

	}),
});





var queryRootType = new GraphQLObjectType({
	name: 'Query',
	fields: {
		users: {
			type: new GraphQLList(userType),
			resolve: (_, args) =>
				User.model.find().exec(),
		},
		user: {
			type: userType,
			args: {
				id: {
					description: 'id of the user',
					type: new GraphQLNonNull(GraphQLID),
				},
			},
			resolve: (_, args) => User.model.findById(args.id).exec(),
		},
	},
});

export default new GraphQLSchema({
	query: queryRootType,
});
