var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Articles Comments Model
 * ===================
 */

var ArticleComment = new keystone.List('ArticleComment', {
	nocreate: true
});

ArticleComment.add({
	article: { type: Types.Relationship, ref: 'Article', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	date: { type: Types.Date, default: Date.now, index: true },
	content: { type: Types.Markdown }
});


/**
 * Registration
 * ============
 */

ArticleComment.defaultColumns = 'article, author, date|20%';
ArticleComment.register();
