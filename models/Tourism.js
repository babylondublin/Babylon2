var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Posts Model
 * ===========
 */

var Tourism = new keystone.List('Tourism', {
	map: { name: 'title' },
	track: true,
	autokey: { path: 'slug', from: 'title', unique: true }
});

Tourism.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	},
	tags: { type: Types.Relationship, ref: 'TourismTag', many: true }
});

/**
 * Virtuals
 * ========
 */

Tourism.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});


/**
 * Relationships
 * =============
 */

Tourism.relationship({ ref: 'TourismComment', refPath: 'tourism', path: 'comments' });


/**
 * Notifications
 * =============
 */

Tourism.schema.methods.notifyAdmins = function(callback) {
	var post = this;
	// Method to send the notification email after data has been loaded
	var sendEmail = function(err, results) {
		if (err) return callback(err);
		async.each(results.admins, function(admin, done) {
			new keystone.Email('admin-notification-new-post').send({
				admin: admin.name.first || admin.name.full,
				author: results.author ? results.author.name.full : 'Somebody',
				title: post.title,
				keystoneURL: 'http://www.sydjs.com/keystone/post/' + post.id,
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
			keystone.list('User').model.find().where('isAdmin', true).exec(next)
		}
	}, sendEmail);
};


/**
 * Registration
 * ============
 */

Tourism.defaultSort = '-publishedDate';
Tourism.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Tourism.register();
