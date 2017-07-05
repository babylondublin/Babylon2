var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'culture';
	locals.page.title = 'Culture';


	view.render(keystone.lang + '/site/culture');

}
