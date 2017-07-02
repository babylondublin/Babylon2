var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Articles Tags Model
 * ===============
 */

var ArticleTag = new keystone.List('ArticleTag', {
    track: true,
	autokey: { from: 'name', path: 'key', unique: true }
});

ArticleTag.add({
	name: { type: String, required: true }
});


/**
 * Relationships
 * =============
 */

ArticleTag.relationship({ ref: 'Article', refPath: 'tags', path: 'articles' });


/**
 * Registration
 * ============
 */

ArticleTag.register();
