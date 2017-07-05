var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Categories Model
 * =====================
 */

var PostTag = new keystone.List('PostTag', {
	track: true,
	autokey: { from: 'name', path: 'key', unique: true }
});

PostTag.add({
	name: { type: String, required: true }
});


/**
 * Relationships
 * =============
 */

PostTag.relationship({ ref: 'Post', refPath: 'tag', path: 'posts' });


/**
 * Registration
 * ============
 */

PostTag.register();
