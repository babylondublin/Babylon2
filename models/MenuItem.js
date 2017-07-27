var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Menu Items Model
 * ===========
 */

var MenuItem = new keystone.List('MenuItem', {
	map: { name: 'title' },
	track: true,
	autokey: { path: 'slug', from: 'title', unique: true }
});

MenuItem.add({
	lang: {type: Types.Select, options: 'en, fr, pr, pl, sp, it', default: "en"},
	title: { type: Types.Select, options:'Places to GO, Things to Do, Living', default:'Places to GO',index: true,required: true },
	tags: { type: Types.Relationship, ref: 'ArticleTag', many: true },
	city: {type: Types.Relationship, ref: 'City', many: true}
});

/**
 * Virtuals
 * ========
 */

MenuItem.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});


/**
 * Relationships
 * =============
 */

MenuItem.relationship({ ref: 'ArticleTag', refPath: 'menu', path: 'tags' });



/**
 * Registration
 * ============
 */

MenuItem.defaultSort = 'title';
MenuItem.defaultColumns = 'title';
MenuItem.register();
