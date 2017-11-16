var keystone = require('keystone'),
moment = require('moment');


exports = module.exports = function(req, res) {

var view = new keystone.View(req, res),
locals = res.locals;

locals.section = 'events';
locals.page.title = 'Events - Babylon';

//load all events
view.on('init', function(next) {
	    var country = req.session.country;

	if(!country || (country == '')){
		return next();
	};
    keystone.list('Event').model.find().where( {'country': country._id})
    .exec(function(err, events) {
        if (err) res.err(err);
        locals.events = events;
        next();
    });
});

var lang = (req.session.languageselected ? req.session.languageselected.key : 'en');

view.render(lang + '/site/events');

}
