/**
 * Created by dorukatalar on 16.08.2017.
 */
var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'otherttd';
    locals.page.title = 'Other Things to Do - Babyblon';
    locals.data = {
        otherttd: []
    };

    // Load the otherttd
    view.on('init', function(next) {

        var q = keystone.list('OtherThingsToDo').model.find().where('state', 'published').sort('-publishedDate').populate('author');

        q.exec(function(err, results) {
            locals.data.otherttd = results;
            next(err);
        });

    });

    // Render the view
    view.render(keystone.lang + '/site/otherthingstodo');

}
