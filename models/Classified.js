var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Classifieds Model
 * ===========
 */

var Classified = new keystone.List('Classified', {
	map: { name: 'title' },
	track: true,
	autokey: { path: 'slug', from: 'title', unique: true }
});

Classified.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
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

Classified.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});


/**
 * Relationships
 * =============
 */

Classified.relationship({ ref: 'ClassifiedComment', refPath: 'classified', path: 'comments' });


/**
 * Notifications
 * =============
 */

Classified.schema.methods.notifyAdmins = function(callback) {
	var classified = this;
	// Method to send the notification email after data has been loaded
	var sendEmail = function(err, results) {
		if (err) return callback(err);
		async.each(results.admins, function(admin, done) {
			new keystone.Email('admin-notification-new-classified').send({
				admin: admin.name.first || admin.name.full,
				author: results.author ? results.author.name.full : 'Somebody',
				title: classified.title,
				keystoneURL: 'http://www.sydjs.com/keystone/post/' + classified.id,
				subject: 'New Classified to Babylon'
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
			if (!classified.author) return next();
			keystone.list('User').model.findById(classified.author).exec(next);
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

Classified.defaultSort = '-publishedDate';
Classified.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Classified.register();
