var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Cities Model
 * ===========
 */

var Country= new keystone.List('Country', {
	map: { name: 'name' },
	track: false,
	autokey: { path: 'slug', from: 'name', unique: true }
});

Country.add({
	name: { type: String, required: true },
    image: { type: Types.CloudinaryImage }
});

/**
 * Virtuals
 * ========
 */

Country.schema.virtual('content.full').get(function() {
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

Country.defaultSort = 'name';
Country.defaultColumns = 'name';
Country.register();
