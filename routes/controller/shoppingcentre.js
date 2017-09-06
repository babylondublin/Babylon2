/**
 * Created by dorukatalar on 16.08.2017.
 */
var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'shopping';
    locals.page.title = 'Shopping Centre - Babyblon';
    locals.data = {
        shopping: []
    };

    // Load the shopping
    view.on('init', function(next) {

        var q = keystone.list('Classified').model.find().where('state', 'published').sort('-publishedDate').populate('author');

        q.exec(function(err, results) {
            locals.data.shopping = results;
            next(err);
        });

    });

    // Render the view
    view.render(keystone.lang + '/site/shoppingcentre');

}
