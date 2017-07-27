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
	//menu  A provisional way to filter the articles in the different sections
	//menu: {type: Types.Select, options:'places_to_go, things_to_do', default: 'places_to_go',index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true },
	image: { type: Types.CloudinaryImage },
	tags: { type: Types.Relationship, ref: 'ArticleTag', many: false },
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

Article.relationship({ ref: 'ArticleComment', refPath: 'article', path: 'comments' });


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
Article.defaultColumns = 'title, state|20%, menu, author|20%, publishedDate|20%';
Article.register();
