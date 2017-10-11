var keystone = require('keystone');

var Article = keystone.list('PlacesToGoArticle');
var ArticleComment = keystone.list('PlacesToGoArticleComment');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// Init locals
	locals.section = 'Places to Go';
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
					locals.page.title = article.title + ' - Turism - Babylon';
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
	// Create a comment
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
				return res.redirect('/places_to_go/' + locals.article.tags.key + '/' + locals.article.slug);
			}
			next();
		});

	});
	// Delete comment
	view.on('get', { remove: 'comment' }, function(next) {

		if (!req.user) {
			req.flash('error', 'You must be signed in to delete a comment.');
			return next();
		}
		ArticleComment.model.findOne({
				_id: req.query.comment,
				article: locals.article.id
			})
			.exec(function(err, comment) {
				if (err) {
					return res.err(err);
				}
				if (!comment) {
					req.flash('error', 'The comment ' + req.query.comment + ' could not be found.');
					return next();
				}
				if (comment.author != req.user.id) {
					req.flash('error', 'Sorry, you must be the author of a comment to delete it.');
					return next();
				}
				comment.remove(function(err) {
					if (err) return res.err(err);
					req.flash('success', 'Your comment has been deleted.');
					return res.redirect('/places_to_go/' + locals.article.tags.key + '/' + locals.article.slug);
				});
			});
	});

	//Update a Comment
	view.on('post', { action: 'update-comment' }, function(next) {

		var contentHtml = '<p>' + req.body.content + '</p>\n';
		
		ArticleComment.model.findOneAndUpdate(
			{_id: req.body.comment}, 
			{$set: {"content.md": req.body.content, "content.html": contentHtml}
		})
		.exec(function(err, comment) {
				if(err) {
					return res.err(err);
				}
				if(!comment){
					req.flash('error', 'The comment ' + req.query.comment + ' could not be found.');
					return next();
				}
				if (comment.author != req.user.id) {
					req.flash('error', 'Sorry, you must be the author of a comment to modify it.');
					return next();
				}
				req.flash('success', 'Your comment has been modified.');
				return res.redirect('/places_to_go/' + locals.article.tags.key + '/' + locals.article.slug);
		});

	});

	// Render the view
	view.render(keystone.lang + '/site/places_to_goOne');

}
