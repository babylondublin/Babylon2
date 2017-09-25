var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Articles Tags Model
 * ===============
 */

var ArticleTag = new keystone.List('ArticleTag', {
    track: false,
	autokey: { from: 'name', path: 'key', unique: true }
});

ArticleTag.add({
	name: { type: String, required: true}
});


/**
 * Relationships
 * =============
 */

//ArticleTag.relationship({ ref: 'Article', refPath: 'tags', path: 'articles' });


/**
 * Registration
 * ============
 */
ArticleTag.defaultColumns = 'name, articles';
ArticleTag.register();

//Inheritence from ArticleTag:
var ThingsToDoArticleTag = new keystone.List('ThingsToDoArticleTag', { inherits: ArticleTag });
ThingsToDoArticleTag.relationship({ ref: 'ThingsToDoArticle', refPath: 'tags', path: 'articles'});
ThingsToDoArticleTag.register();

var PlacesToGoArticleTag = new keystone.List('PlacesToGoArticleTag', { inherits: ArticleTag });
PlacesToGoArticleTag.relationship({ ref: 'PlacesToGoArticle', refPath: 'tags', path: 'articles'});
PlacesToGoArticleTag.register();

var LivingArticleTag = new keystone.List('LivingArticleTag', { inherits: ArticleTag });
LivingArticleTag.relationship({ ref: 'LivingArticle', refPath: 'tags', path: 'articles'});
LivingArticleTag.register();

var PlanYourTripArticleTag = new keystone.List('PlanYourTripArticleTag', { inherits: ArticleTag });
PlanYourTripArticleTag.relationship({ ref: 'PlanYourTripArticle', refPath: 'tags', path: 'articles'});
PlanYourTripArticleTag.register();