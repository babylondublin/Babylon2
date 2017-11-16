var keystone = require('keystone'),
moment = require('moment');

var Event = keystone.list('Event');

exports = module.exports = function(req, res) {

var view = new keystone.View(req, res),
    locals = res.locals;

locals.section = 'events'; //member instead?
locals.moment = moment;


// Load the Member

view.on('init', function(next) {
    Event.model.findOne()
    .where('slug', req.params.event) // key = slug
    .exec(function(err, event) {
        if (err) return res.err(err);
        if (!event) {
            req.flash('info', 'Sorry, we couldn\'t find a matching event');
            return res.redirect('/events')
        }
        locals.event = event;
        next();
    });
});

    var lang = (req.session.languageselected ? req.session.languageselected.key : 'en');

view.render(lang + '/site/event');

}