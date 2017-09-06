/**
 * Created by dorukatalar on 15.08.2017.
 */
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Citys Model
 * ===========
 */

var City = new keystone.List('City', {
    map: { name: 'title' },
    track: true,
    autokey: { path: 'slug', from: 'title', unique: true }
});

City.add({
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
    tags: { type: Types.Relationship, ref: 'CityTag', many: true }
});

/**
 * Virtuals
 * ========
 */

City.schema.virtual('content.full').get(function() {
    return this.content.extended || this.content.brief;
});


/**
 * Relationships
 * =============
 */

City.relationship({ ref: 'CityComment', refPath: 'city', path: 'comments' });


/**
 * Notifications
 * =============
 */

City.schema.methods.notifyAdmins = function(callback) {
    var city = this;
    // Method to send the notification email after data has been loaded
    var sendEmail = function(err, results) {
        if (err) return callback(err);
        async.each(results.admins, function(admin, done) {
            new keystone.Email('admin-notification-new-city').send({
                admin: admin.name.first || admin.name.full,
                author: results.author ? results.author.name.full : 'Somebody',
                title: city.title,
                keystoneURL: 'http://www.sydjs.com/keystone/city/' + city.id,
                subject: 'New City to Babylon'
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
            if (!city.author) return next();
            keystone.list('User').model.findById(city.author).exec(next);
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

City.defaultSort = '-publishedDate';
City.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
City.register();
