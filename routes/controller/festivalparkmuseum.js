/**
 * Created by dorukatalar on 16.08.2017.
 */
var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'festivalpm';
    locals.page.title = 'Festival, Park, Museum - Babyblon';
    locals.data = {
        festivalpm: []
    };

    // Load the festivalpm
    view.on('init', function(next) {

        var q = keystone.list('Classified').model.find().where('state', 'published').sort('-publishedDate').populate('author');

        q.exec(function(err, results) {
            locals.data.festivalpm = results;
            next(err);
        });

    });

    // Render the view
    view.render(keystone.lang + '/site/festivalparkmuseum');

}
