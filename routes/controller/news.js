var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'news';
	locals.page.title = 'News - Babyblon';
	locals.filters = {
		tag: req.params.tag
	};
	locals.data = {
		posts: [],
		tags: []
	};

	//if no Cookie
	if(!req.cookies.country || (req.cookies.country == '')){
		req.flash('error', 'Search a country first please.');
	};

	// Load all tags
	view.on('init', function(next) {

		//if no Cookie
		if(!req.cookies.country || (req.cookies.country == '')){
		return next();
		};

		keystone.list('PostTag').model.find().sort('name').exec(function(err, results) {
			
			if (err || !results.length) {
				return next(err);
			}
			
			locals.data.tags = results;
			
			// Load the counts for each tag
			async.each(locals.data.tags, function(tag, next) {
				
				keystone.list('Post').model.count().where('tag').in([tag.id]).exec(function(err, count) {
					tag.postCount = count;
					next(err);
				});
				
			}, function(err) {
				next(err);
			});
			
		});
		
	});
	
	// Load the current tag filter
	view.on('init', function(next) {

		//if no Cookie
		if(!req.cookies.country || (req.cookies.country == '')){
		return next();
		};

		if (req.params.tag) {
			keystone.list('PostTag').model.findOne({ key: locals.filters.tag }).exec(function(err, result) {
				locals.data.tag = result;
				next(err);
			});
		} else {
			next();
		}
		
	});
	
	// Load the posts
	view.on('init', function(next) {
		var cookie = req.cookies.country;
		//if no Cookie
		if(!cookie || (cookie == '')){
		return next();
		};

		var q = keystone.list('Post').model.find({lang: keystone.lang}).where({$and:[{'state':'published'}, {'country': cookie}]}).sort('-publishedDate').populate('author tag').limit(6);
		
		if (locals.data.tag) {
			q.where('tag').in([locals.data.tag]);
		}
		
		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render(keystone.lang + '/site/news');

	
}
