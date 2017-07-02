var keystone = require('keystone'),
	Classified = keystone.list('Classified');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'me';
	locals.page.title = 'Create a Classified - Babylon';
	
	view.on('post', { action: 'create-classified' }, function(next) {

		// handle form
		var newClassified = new Classified.model({
				author: locals.user.id,
				publishedDate: new Date()
			}),

			updater = newClassified.getUpdateHandler(req, res, {
				errorMessage: 'There was an error creating your new classified:'
			});
		
		// automatically publish classifieds by admin users
		if (locals.user.isAdmin) {
			newClassified.state = 'published';
		}
		
		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'title, image, content.extended'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				newClassified.notifyAdmins();
				req.flash('success', 'Your classified has been added' + ((newClassified.state == 'draft') ? ' and will appear on the site once it\'s been approved' : '') + '.');
				return res.redirect('/classifieds/classified/' + newClassified.slug);
			}
			next();
		});

	});
	
	view.render('site/createClassified');
	
}
