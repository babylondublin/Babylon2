/**
 * Created by dorukatalar on 16.08.2017.
 */
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Other Things To Do Model
 * ===========
 */

var tags_0 = new keystone.List('tags_0', {
    map: { name: 'title' },
    track: true,
    autokey: { path: 'slug', from: 'title', unique: true }
});

tags_0.add({
    lang: {type: Types.Select, options: 'en, fr, pr, pl, sp, it', default: "en"},
    title: { type: String, required: true },
    state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
    author: { type: Types.Relationship, ref: 'User', index: true },
    publishedDate: { type: Types.Date, index: true },
    image: { type: Types.CloudinaryImage },
    content: {
        brief: { type: Types.Html, wysiwyg: true, height: 150 },
        extended: { type: Types.Html, wysiwyg: true, height: 400 }
    },
    tags: { type: Types.Relationship, ref: 'tags_0Tag', many: true }
});

/**
 * Virtuals
 * ========
 */

tags_0.schema.virtual('content.full').get(function() {
    return this.content.extended || this.content.brief;
});


/**
 * Relationships
 * =============
 */

tags_0.relationship({ ref: 'tags_0Comment', refPath: 'tags_0', path: 'comments' });


/**
 * Notifications
 * =============
 */

tags_0.schema.methods.notifyAdmins = function(callback) {
    var tags_0 = this;
    // Method to send the notification email after data has been loaded
    var sendEmail = function(err, results) {
        if (err) return callback(err);
        async.each(results.admins, function(admin, done) {
            new keystone.Email('admin-notification-new-tags_0').send({
                admin: admin.name.first || admin.name.full,
                author: results.author ? results.author.name.full : 'Somebody',
                title: tags_0.title,
                keystoneURL: 'http://www.sydjs.com/keystone/tags_0/' + tags_0.id,
                subject: 'New tags_0 Centre to Babylon'
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
            if (!tags_0.author) return next();
            keystone.list('User').model.findById(tags_0.author).exec(next);
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

tags_0.defaultSort = '-publishedDate';
tags_0.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
tags_0.register();
