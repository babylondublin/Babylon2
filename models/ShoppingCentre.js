/**
 * Created by dorukatalar on 16.08.2017.
 */
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Shopping Centres Model
 * ===========
 */

var Shopping = new keystone.List('Shopping', {
    map: { name: 'title' },
    track: true,
    autokey: { path: 'slug', from: 'title', unique: true }
});

Shopping.add({
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
    tags: { type: Types.Relationship, ref: 'ShoppingTag', many: true }
});

/**
 * Virtuals
 * ========
 */

Shopping.schema.virtual('content.full').get(function() {
    return this.content.extended || this.content.brief;
});


/**
 * Relationships
 * =============
 */

Shopping.relationship({ ref: 'ShoppingComment', refPath: 'Shopping', path: 'comments' });


/**
 * Notifications
 * =============
 */

Shopping.schema.methods.notifyAdmins = function(callback) {
    var Shopping = this;
    // Method to send the notification email after data has been loaded
    var sendEmail = function(err, results) {
        if (err) return callback(err);
        async.each(results.admins, function(admin, done) {
            new keystone.Email('admin-notification-new-Shopping').send({
                admin: admin.name.first || admin.name.full,
                author: results.author ? results.author.name.full : 'Somebody',
                title: Shopping.title,
                keystoneURL: 'http://www.sydjs.com/keystone/Shopping/' + Shopping.id,
                subject: 'New Shopping Centre to Babylon'
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
            if (!Shopping.author) return next();
            keystone.list('User').model.findById(Shopping.author).exec(next);
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

Shopping.defaultSort = '-publishedDate';
Shopping.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Shopping.register();
