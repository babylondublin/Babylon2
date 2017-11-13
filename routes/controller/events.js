var keystone = require('keystone'),
moment = require('moment');


exports = module.exports = function(req, res) {

var view = new keystone.View(req, res),
locals = res.locals;

locals.section = 'events';
locals.page.title = 'Events - Babylon';

//load all events
view.on('init', function(next) {
    var cookie = req.cookies.country;
    keystone.list('Event').model.find().where( {'country': cookie})
    .exec(function(err, events) {
        if (err) res.err(err);
        locals.events = events;
        next();
    });
});

view.render(keystone.lang + '/site/events');

}
