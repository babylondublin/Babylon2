var keystone = require('keystone');

var Article = keystone.list('Article');
var ArticleComment = keystone.list('ArticleComment');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// Init locals
	locals.section = 'Tourism';
	locals.filters = {
		article: req.params.article
	};

	view.on('init', function(next) {

		Article.model.findOne()
			.where('slug', locals.filters.article)
			.populate('author tags')
			.exec(function(err, article) {

				if (err) return res.err(err);
				if (!article) return res.notfound('Article not found');

				// Allow admins or the author to see draft articles
				if (article.state == 'published' || (req.user && req.user.isAdmin) || (req.user && article.author && (req.user.id == article.author.id))) {
					locals.article = article;
					locals.article.populateRelated('comments[author]', next);
					locals.page.title = article.title + ' - Blog - Babylon';
				} else {
					return res.notfound('Article not found');
				}

			});

	});

	// Load recent article
	view.query('data.articles',
		Article.model.find()
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author')
			.limit('4')
	);

	view.on('post', { action: 'create-comment' }, function(next) {

		// handle form
		var newArticleComment = new ArticleComment.model({
				article: locals.article.id,
				author: locals.user.id
			}),
			updater = newArticleComment.getUpdateHandler(req, res, {
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
				return res.redirect('/tourism/article/' + locals.article.slug);
			}
			next();
		});

	});

	// Render the view
	view.render('site/tourismOne');

}
