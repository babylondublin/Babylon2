var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Articles Tags Model
 * ===============
 */

var TourismTag = new keystone.List('TourismTag', {
    track: true,
	autokey: { from: 'name', path: 'key', unique: true }
});

TourismTag.add({
	name: { type: String, required: true }
});


/**
 * Relationships
 * =============
 */

TourismTag.relationship({ ref: 'Tourism', refPath: 'tags', path: 'tourism' });


/**
 * Registration
 * ============
 */

TourismTag.register();

