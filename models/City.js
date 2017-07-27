var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Cities Model
 * ===========
 */

var City = new keystone.List('City', {
	map: { name: 'name' },
	track: true,
	autokey: { path: 'slug', from: 'name', unique: true }
});

City.add({
	name: { type: String, required: true, default:'Dublin' },
    menuItems: {type: Types.Relationship, ref:'MenuItem', many: true},
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

City.relationship({ ref: 'MenuItem', refPath: 'city', path: 'Menu Items' });


/**
 * Registration
 * ============
 */

City.defaultSort = 'name';
City.defaultColumns = 'name, menu';
City.register();
