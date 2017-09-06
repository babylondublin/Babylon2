var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Posts Model
 * ===========
 */

var OtherThingsToDo = new keystone.List('OtherThingsToDo', {
    map: { name: 'title' },
    track: true,
    autokey: { path: 'slug', from: 'title', unique: true }
});

OtherThingsToDo.add({
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
    tags: { type: Types.Relationship, ref: 'OthertTag', many: true }
});

/**
 * Virtuals
 * ========
 */

OtherThingsToDo.schema.virtual('content.full').get(function() {
    return this.content.extended || this.content.brief;
});


/**
 * Relationships
 * =============
 */

OtherThingsToDo.relationship({ ref: 'OtherTDComment', refPath: 'otherthingstodo', path: 'comments' });


/**
 * Notifications
 * =============
 */

OtherThingsToDo.schema.methods.notifyAdmins = function(callback) {
    var otherthingstodo = this;
    // Method to send the notification email after data has been loaded
    var sendEmail = function(err, results) {
        if (err) return callback(err);
        async.each(results.admins, function(admin, done) {
            new keystone.Email('admin-notification-new-otherthingstodo').send({
                admin: admin.name.first || admin.name.full,
                author: results.author ? results.author.name.full : 'Somebody',
                title: otherthingstodo.title,
                keystoneURL: 'http://www.sydjs.com/keystone/otherthingstodo/' + otherthingstodo.id,
                subject: 'New OtherThingsToDo to Babylon'
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
            if (!otherthingstodo.author) return next();
            keystone.list('User').model.findById(otherthingstodo.author).exec(next);
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

OtherThingsToDo.defaultSort = '-publishedDate';
OtherThingsToDo.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
OtherThingsToDo.register();
