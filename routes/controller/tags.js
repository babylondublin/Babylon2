/**
 * Created by dorukatalar on 16.08.2017.
 */
var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'tags';
    locals.page.title = 'Tags - Babyblon';
    locals.data = {
        tags: []
    };

    // Load the tags
    view.on('init', function(next) {

        var q = keystone.list('News').model.find().where('state', 'published').sort('-publishedDate').populate('author');

        q.exec(function(err, results) {
            locals.data.tags = results;
            next(err);
        });

    });

    // Render the view
    view.render(keystone.lang + '/site/tags');

}
