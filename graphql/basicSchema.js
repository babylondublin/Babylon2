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
var Meetup = keystone.list('Meetup');
var User = keystone.list('User');



function getMeetup (id) {
	if (id === 'next') {
		return Meetup.model.findOne().sort('-startDate')
			.where('state', 'active').exec();
	} else if (id === 'last') {
		return Meetup.model.findOne().sort('-startDate')
			.where('state', 'past').exec();
	} else {
		return Meetup.model.findById(id).exec();
	}
}

var meetupStateEnum = new GraphQLEnumType({
	name: 'MeetupState',
	description: 'The state of the meetup',
	values: {
		draft: { description: "No published date, it's a draft meetup" },
		scheduled: { description: "Publish date is before today, it's a scheduled meetup" },
		active: { description: "Publish date is after today, it's an active meetup" },
		past: { description: "Meetup date plus one day is after today, it's a past meetup" },
	},
});

var meetupType = new GraphQLObjectType({
	name: 'Meetup',
	fields: () => ({
		id: { type: new GraphQLNonNull(GraphQLID) },
		name: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The name of the meetup.',
		},
		publishedDate: keystoneTypes.date(Meetup.fields.publishedDate),
		state: { type: new GraphQLNonNull(meetupStateEnum) },
		startDate: keystoneTypes.datetime(Meetup.fields.startDate),
		endDate: keystoneTypes.datetime(Meetup.fields.endDate),
		place: { type: GraphQLString },
		map: { type: GraphQLString },
		description: { type: GraphQLString },
		url: { type: GraphQLString }
	}),
});



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
		meetups: {
			type: new GraphQLList(meetupType),
			resolve: (_, args) =>
				Meetup.model.find().exec(),
		},
		meetup: {
			type: meetupType,
			args: {
				id: {
					description: 'id of the meetup, can be "next" or "last"',
					type: new GraphQLNonNull(GraphQLID),
				},
			},
			resolve: (_, args) => getMeetup(args.id),
		},
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
