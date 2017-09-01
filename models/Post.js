var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Posts Model
 * ===========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	track: true,
	autokey: { path: 'slug', from: 'title', unique: true }
});

Post.add({
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
	},
	tag: { type: Types.Relationship, ref: 'PostTag', many: true }
});


Post.schema.index({title: 'text', 'content.brief': 'text', 'content.extended': 'text'});

/**
 * Virtuals
 * ========
 */

Post.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});


/**
 * Relationships
 * =============
 */

Post.relationship({ ref: 'PostComment', refPath: 'post', path: 'comments' });


/**
 * Notifications
 * =============
 */

Post.schema.methods.notifyAdmins = function(callback) {
	var post = this;
	// Method to send the notification email after data has been loaded
	var sendEmail = function(err, results) {
		if (err) return callback(err);
		async.each(results.admins, function(admin, done) {
			new keystone.Email('admin-notification-new-post').send({
				admin: admin.name.first || admin.name.full,
				author: results.author ? results.author.name.full : 'Somebody',
				title: post.title,
				keystoneURL: 'https://www.sydjs.com/keystone/post/' + post.id,
				subject: 'New Post to Babylon'
			}, {
				to: admin,
				from: {
					name: 'Babylon',
					email: 'contact@babylon.com'
				}
			}, done);
		}, callback);
	}
	// Query data in parallel
	async.parallel({
		author: function(next) {
			if (!post.author) return next();
			keystone.list('User').model.findById(post.author).exec(next);
		},
		admins: function(next) {
			keystone.list('User').model.find().where({$or:[{'isAdmin': true}, {'isJournalist': true}]}).exec(next)
		}
	}, sendEmail);
};


/**
 * Registration
 * ============
 */

Post.defaultSort = '-publishedDate';
Post.defaultColumns = 'title, state|20%, country, author|20%, publishedDate|20%';
Post.register();
