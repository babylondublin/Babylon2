var keystone = require('keystone'),
_ = require('lodash');

var Country = keystone.list('Country');

exports = module.exports = function(req, res) {

var view = new keystone.View(req, res),
    locals = res.locals;

locals.section = 'countries';
locals.page.title = 'Countries - Babylon';



// Load Countries

view.on('init', function(next) {
    Country.model.find()
    //.sort('name')
    .exec(function(err, countries) {
        if (err) res.err(err);
        locals.countries= countries;
        next();
    });
});


view.render(keystone.lang +  '/site/countries');
}