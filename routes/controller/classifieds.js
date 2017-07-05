var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'classifieds';
	locals.page.title = 'Classifieds - Babyblon';
	locals.data = {
		classifieds: []
	};
	
	// Load the classifieds
	view.on('init', function(next) {
		
		var q = keystone.list('Classified').model.find().where('state', 'published').sort('-publishedDate').populate('author');
		
		q.exec(function(err, results) {
			locals.data.classifieds = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render(keystone.lang + '/site/classifieds');
	
}
