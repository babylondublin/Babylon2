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
	article: { type: Types.Relationship, ref: 'Article', index: true, noedit:true },
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

//Inheritance from ArticleComment

var ThingsToDoArticleComment = new keystone.List('ThingsToDoArticleComment', { inherits: ArticleComment });
ThingsToDoArticleComment.add({article:{type: Types.Relationship, ref: 'ThingsToDoArticle', index:true, noedit:true}});
ThingsToDoArticleComment.relationship({ ref: 'ThingsToDoArticle', refPath: 'tag', path: 'articles'});
ThingsToDoArticleComment.register();

var PlacesToGoArticleComment = new keystone.List('PlacesToGoArticleComment', { inherits: ArticleComment });
PlacesToGoArticleComment.add({article:{type: Types.Relationship, ref: 'PlacesToGoArticle', index:true, noedit:true}});
PlacesToGoArticleComment.relationship({ ref: 'PlacesToGoArticle', refPath: 'tag', path: 'articles'});
PlacesToGoArticleComment.register();

var LivingArticleComment = new keystone.List('LivingArticleComment', { inherits: ArticleComment });
LivingArticleComment.add({article:{type: Types.Relationship, ref: 'LivingArticle', index:true, noedit:true}});
LivingArticleComment.relationship({ ref: 'LivingArticle', refPath: 'tag', path: 'articles'});
LivingArticleComment.register();