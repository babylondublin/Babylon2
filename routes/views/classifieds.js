var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'classifieds';
	locals.page.title = 'Classifieds';


	view.render('site/classifieds');

}
