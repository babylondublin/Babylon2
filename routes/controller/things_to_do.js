var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'things_to_do';
	locals.page.title = 'Things to Do';


	view.render(keystone.lang + '/site/things_to_do');

}
