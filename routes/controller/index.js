var keystone = require('keystone'),
	moment = require('moment')

var Post = keystone.list('Post')

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
	locals = res.locals;
	
	locals.section = 'home';
	locals.page.title = 'Welcome to Babylon';
	


	locals.user = req.user;


	// Decide which to render
	

	
	view.render(keystone.lang + '/site/index');
	
}
