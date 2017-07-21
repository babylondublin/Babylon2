var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'plan_your_trip';
	locals.page.title = 'Plan Your Trip';


	view.render(keystone.lang + '/site/plan_your_trip');

}
