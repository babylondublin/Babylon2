var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Articles Comments Model
 * ===================
 */

var TourismComment = new keystone.List('TourismComment', {
	nocreate: true
});

TourismComment.add({
	tourism: { type: Types.Relationship, ref: 'Tourism', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	date: { type: Types.Date, default: Date.now, index: true },
	content: { type: Types.Markdown }
});


/**
 * Registration
 * ============
 */

TourismComment.defaultColumns = 'tourism, author, date|20%';
TourismComment.register();

