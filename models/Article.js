var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Articles Model
 * ===========
 */

var Article = new keystone.List('Article', {
	map: { name: 'title' },
	track: true,
	autokey: { path: 'slug', from: 'title', unique: true }
});

Article.add({
	lang: {type: Types.Select, options: 'en, fr, pr, pl, sp, it', default: "en"},
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	country: {type: Types.Relationship, ref: 'Country', index:true},
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	}
});

/**
 * Virtuals
 * ========
 */

Article.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});


/**
 * Relationships
 * =============
 */


//Article.relationship({ ref: 'ArticleComment', refPath: 'article', path: 'comments'});


/**
 * Notifications
 * =============
 */

Article.schema.methods.notifyAdmins = function(callback) {
	var article = this;
	// Query data in parallel
	async.parallel({
		author: function(next) {
			if (!article.author) return next();
			keystone.list('User').model.findById(article.author).exec(next);
		},
		admins: function(next) {
			keystone.list('User').model.find().where('isAdmin', true).exec(next)
		}
	}, sendEmail);
};


/**
 * Registration
 * ============
 */

Article.defaultSort = '-publishedDate';
Article.defaultColumns = 'title, state|20%, country, tag, author|20%, publishedDate|20%';
Article.register();


//Inheritence from Article:
var ThingsToDoArticle = new keystone.List('ThingsToDoArticle', { inherits: Article });
ThingsToDoArticle.add({tags:{type: Types.Relationship, ref: 'ThingsToDoArticleTag', many: false}});
ThingsToDoArticle.relationship({ ref: 'ThingsToDoArticleComment', refPath: 'article', path: 'comments'});
ThingsToDoArticle.register();

var PlacesToGoArticle = new keystone.List('PlacesToGoArticle', { inherits: Article });
PlacesToGoArticle.add({tags:{type: Types.Relationship, ref: 'PlacesToGoArticleTag', many: false }});
PlacesToGoArticle.relationship({ ref: 'PlacesToGoArticleComment', refPath: 'article', path: 'comments'});
PlacesToGoArticle.register();

var LivingArticle = new keystone.List('LivingArticle', { inherits: Article });
LivingArticle.add({tags:{type: Types.Relationship, ref: 'LivingArticleTag', many: false}});
LivingArticle.relationship({ ref: 'LivingArticleComment', refPath: 'article', path: 'comments'});
LivingArticle.register();

var PlanYourTrip = new keystone.List('PlanYourTripArticle', { inherits: Article });
PlanYourTrip.add({tags:{type: Types.Relationship, ref: 'PlanYourTripArticleTag', many: false}});
PlanYourTrip.relationship({ ref: 'PlanYourTripArticleComment', refPath: 'article', path: 'comments'});
PlanYourTrip.register();