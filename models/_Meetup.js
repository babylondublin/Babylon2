var _ = require('lodash');
var keystone = require('keystone');
var moment = require('moment');
var Types = keystone.Field.Types;

/**
 * Meetups Model
 * =============
 */

var Meetup = new keystone.List('Meetup', {
	track: true,
	autokey: { path: 'key', from: 'name', unique: true }
});

Meetup.add({
	name: { type: String, required: true, initial: true },
	publishedDate: { type: Types.Date, index: true },

	state: { type: Types.Select, options: 'draft, scheduled, active, past', noedit: true },

	startDate: { type: Types.Datetime, required: true, initial: true, index: true, width: 'short', note: 'e.g. 2014-07-15 / 6:00pm' },
	endDate: { type: Types.Datetime, required: true, initial: true, index: true, width: 'short', note: 'e.g. 2014-07-15 / 9:00pm' },

	place: { type: String, required: false, initial: true, width: 'medium', default: 'Level 6, 341 George St (Atlassian)', note: 'Usually Atlassian – Level 6, 341 George St' },
	map: { type: String, required: false, initial: true, width: 'medium', default: 'Level 6, 341 George St', note: 'Level 6, 341 George St' },
	description: { type: Types.Html, wysiwyg: true },


	legacy: { type: Boolean, noedit: true, collapse: true },
});




// Relationships
// ------------------------------

Meetup.relationship({ ref: 'Talk', refPath: 'meetup', path: 'talks' });




// Virtuals
// ------------------------------

Meetup.schema.virtual('url').get(function() {
	return '/meetups/' + this.key;
});







// Pre Save
// ------------------------------

Meetup.schema.pre('save', function(next) {
	var meetup = this;
	// no published date, it's a draft meetup
	if (!meetup.publishedDate) {
		meetup.state = 'draft';
	}
	// meetup date plus one day is after today, it's a past meetup
	else if (moment().isAfter(moment(meetup.startDate).add('day', 1))) {
		meetup.state = 'past';
	}
	// publish date is after today, it's an active meetup
	else if (moment().isAfter(meetup.publishedDate)) {
		meetup.state = 'active';
	}
	// publish date is before today, it's a scheduled meetup
	else if (moment().isBefore(moment(meetup.publishedDate))) {
		meetup.state = 'scheduled';
	}
	next();
});




// Methods
// ------------------------------




Meetup.schema.set('toJSON', {
	transform: function(doc, rtn, options) {
		return _.pick(doc, '_id', 'name', 'startDate', 'endDate', 'place', 'map', 'description');
	}
});


/**
 * Registration
 * ============
 */

Meetup.defaultSort = '-startDate';
Meetup.defaultColumns = 'name, state|10%, startDate|15%, publishedDate|15%';
Meetup.register();
