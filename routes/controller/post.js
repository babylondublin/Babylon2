var keystone = require('keystone');

var Post = keystone.list('Post');
var PostComment = keystone.list('PostComment');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// Init locals
	locals.section = 'News';
	locals.filters = {
		post: req.params.post
	};

	view.on('init', function(next) {

		Post.model.findOne()
			.where('slug', locals.filters.post)
			.populate('author categories')
			.exec(function(err, post) {

				if (err) return res.err(err);
				if (!post) return res.notfound('Post not found');

				// Allow admins or the author to see draft posts
				if (post.state == 'published' || (req.user && req.user.isAdmin) || (req.user && post.author && (req.user.id == post.author.id))) {
					locals.post = post;
					locals.post.populateRelated('comments[author]', next);
					locals.page.title = post.title + ' - News - Babylon';
				} else {
					return res.notfound('Post not found');
				}

			});

	});

	// Load recent posts
	view.query('data.posts',
		Post.model.find()
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author')
			.limit('4')
	);
	// Create a comment
	view.on('post', { action: 'create-comment' }, function(next) {

		// handle form
		var newPostComment = new PostComment.model({
				post: locals.post.id,
				author: locals.user.id
			}),
			updater = newPostComment.getUpdateHandler(req, res, {
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
				return res.redirect('/news/post/' + locals.post.slug);
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
		PostComment.model.findOne({
				_id: req.query.comment,
				post: locals.post.id
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
					return res.redirect('/news/post/' + locals.post.slug);
				});
			});
	});
	// Delete New (post)
	// inspired by: https://gist.github.com/wuhaixing/e90b8497f925ff9c7bfc
	view.on('get', { remove: 'post' }, function(next) {
			if (!req.user) {
				req.flash('error', 'You must be signed in to delete a classified.');
				return next();
			}
		Post.model.findOne({
				_id: req.query.post
			})
			.exec(function(err, post) {
				if (err) {
					if (err.name == 'CastError') {
						req.flash('error', 'The post' + req.query.post+ ' could not be found.');
						return next();
					}
					return res.err(err);
				}
				if (!post) {
					req.flash('error', 'The post ' + req.query.post + ' could not be found.');
					return next();
				}
				if (post.author != req.user.id) {
					req.flash('error', 'Sorry, you must be the author of a post to delete it.');
					return next();
				}
				post.remove(function(err) {
					if (err) return res.err(err);
					req.flash('success', 'Your post has been deleted.');
					return res.redirect('/news');
				});
			});
	});
	// Render the view
	view.render(keystone.lang + '/site/post');

}
