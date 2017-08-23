var keystone = require('keystone'),
	Post = keystone.list('Post'),
	PostTag = keystone.list('PostTag');


exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;

	//if not admin or jurnalist
	if(!locals.user.isAdmin && !locals.user.isJournalist) res.redirect('/');
	
	locals.section = 'me';
	locals.page.title = 'Create a Post - Babylon';

	// Load PostTags
	view.on('init', function(next) {
		PostTag.model.find()
		.sort('name')		
		.exec(function(err, tagsList) {
			if (err) res.err(err);
			locals.tags = tagsList;
			next();
		});
	});

	view.on('post', { action: 'create-post' }, function(next) {
		
		var cookie = req.cookies.country;
		// handle form
		var newPost = new Post.model({
				author: locals.user.id,
				publishedDate: new Date(),
				country: cookie
			}),

			updater = newPost.getUpdateHandler(req, res, {
				errorMessage: 'There was an error creating your new Post:'
			});
		
		// automatically publish posts by admin users
		if (locals.user.isAdmin || locals.user.isJournalist) {
			newPost.state = 'published';
		}
		
		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'title, tag, image, content.extended'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				newPost.notifyAdmins();
				req.flash('success', 'Your post has been added' + ((newPost.state == 'draft') ? ' and will appear on the site once it\'s been approved' : '') + '.');
				return res.redirect('/news/post/' + newPost.slug);
			}
			next();
		});

	});
	
	view.render(keystone.lang + '/site/createPost');
	
}
