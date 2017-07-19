var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Articles Types Model
 * ===============
 */

var ArticleType = new keystone.List('ArticleType', {
    track: true,
	autokey: { from: 'name', path: 'key', unique: true }
});

ArticleType.add({
	name: { type: String, required: true }
});


/**
 * Relationships
 * =============
 */

ArticleType.relationship({ ref: 'Article', refPath: 'types', path: 'articles' });


/**
 * Registration
 * ============
 */

ArticleType.register();
