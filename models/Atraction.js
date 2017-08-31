/**
 * Created by dorukatalar on 15.08.2017.
 */
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Attractions Model
 * ===========
 */

var Attraction = new keystone.List('Attraction', {
    map: { name: 'title' },
    track: true,
    autokey: { path: 'slug', from: 'title', unique: true }
});

Attraction.add({
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
    tags: { type: Types.Relationship, ref: 'AttractionTag', many: true }
});

/**
 * Virtuals
 * ========
 */

Attraction.schema.virtual('content.full').get(function() {
    return this.content.extended || this.content.brief;
});


/**
 * Relationships
 * =============
 */

Attraction.relationship({ ref: 'AttractionComment', refPath: 'attraction', path: 'comments' });


/**
 * Notifications
 * =============
 */

Attraction.schema.methods.notifyAdmins = function(callback) {
    var attraction = this;
    // Method to send the notification email after data has been loaded
    var sendEmail = function(err, results) {
        if (err) return callback(err);
        async.each(results.admins, function(admin, done) {
            new keystone.Email('admin-notification-new-attraction').send({
                admin: admin.name.first || admin.name.full,
                author: results.author ? results.author.name.full : 'Somebody',
                title: attraction.title,
                keystoneURL: 'http://www.sydjs.com/keystone/attraction/' + attraction.id,
                subject: 'New Attraction to Babylon'
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
            if (!attraction.author) return next();
            keystone.list('User').model.findById(attraction.author).exec(next);
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

Attraction.defaultSort = '-publishedDate';
Attraction.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Attraction.register();
  
