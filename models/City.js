var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Cities Model
 * ===========
 */

var City = new keystone.List('City', {
	map: { name: 'name' },
	track: false,
	autokey: { path: 'slug', from: 'name', unique: true }
});

City.add({
	name: { type: String, required: true },
    image: { type: Types.CloudinaryImage }
});

/**
 * Virtuals
 * ========
 */

City.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});


/**
 * Relationships
 * =============
 */


/**
 * Registration
 * ============
 */

City.defaultSort = 'name';
City.defaultColumns = 'name';
City.register();
