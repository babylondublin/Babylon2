var keystone = require('keystone'),
moment = require('moment');


exports = module.exports = function(req, res) {

var view = new keystone.View(req, res),
locals = res.locals;

locals.section = 'events';
locals.page.title = 'Events - Babylon';



locals.user = req.user;


// Decide which to render
if(!req.cookies.country || (req.cookies.country == '')){
    req.flash('error', 'Search a country first please.');
};


view.render(keystone.lang + '/site/events');

}
