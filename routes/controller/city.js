/**
 * Created by dorukatalar on 15.08.2017.
 */
var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'citys';
    locals.page.title = 'Citys - Babyblon';
    locals.data = {
        citys: []
    };

    // Load the citys
    view.on('init', function(next) {

        var q = keystone.list('City').model.find().where('state', 'published').sort('-publishedDate').populate('author');

        q.exec(function(err, results) {
            locals.data.citys = results;
            next(err);
        });

    });

    // Render the view
    view.render(keystone.lang + '/site/city.pug');

}
