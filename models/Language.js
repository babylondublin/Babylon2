var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Cities Model
 * ===========
 */

var Language= new keystone.List('Language', {
	track: true,
	autokey: { path: 'slug', from: 'name', unique: true }
});

Language.add({
	name: { type: String, required: true, index: true },
	key: { type: String, initial:true, required: true, index: true }
});

/**
 * Virtuals
 * ========
 */


/**
 * Relationships
 * =============
 */
Language.relationship({ref:'ThingsToDoArticle',refPath:'language',path:'Things to DO Articles'});
Language.relationship({ref:'PlacesToGoArticle',refPath:'language',path:'Places to GO Articles'});
Language.relationship({ref:'LivingArticle',refPath:'language',path:'Living Articles'});

/**
 * Registration
 * ============
 */

Language.defaultColumns = 'name, key';
Language.register();
