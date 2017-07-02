var keystone = require('keystone');

var Classified = keystone.list('Classified');
var ClassifiedComment = keystone.list('ClassifiedComment');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// Init locals
	locals.section = 'blog';
	locals.filters = {
		classified: req.params.classified
	};

	view.on('init', function(next) {

		Classified.model.findOne()
			.where('slug', locals.filters.classified)
			.populate('author')
			.exec(function(err, classified) {

				if (err) return res.err(err);
				if (!classified) return res.notfound('Classified not found');

				// Allow admins or the author to see draft classifieds
				if (classified.state == 'published' || (req.user && req.user.isAdmin) || (req.user && classified.author && (req.user.id == classified.author.id))) {
					locals.classified = classified;
					locals.classified.populateRelated('comments[author]', next);
					locals.page.title = classified.title + ' - Classifieds - Babylon';
				} else {
					return res.notfound('Classified not found');
				}

			});

	});

	// Load recent classifieds
	view.query('data.classifieds',
		Classified.model.find()
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author')
			.limit('4')
	);

	view.on('post', { action: 'create-comment' }, function(next) {

		// handle form
		var newClassifiedComment = new ClassifiedComment.model({
				classified: locals.classified.id,
				author: locals.user.id
			}),
			updater = newClassifiedComment.getUpdateHandler(req, res, {
				errorMessage: 'There was an error creating your comment:'
			});

		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'content'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				req.flash('success', 'Your comment has been added successfully.');
				return res.redirect('/classifieds/classified/' + locals.classified.slug);
			}
			next();
		});

	});

	// Render the view
	view.render('site/classified');

}
