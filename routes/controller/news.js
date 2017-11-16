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
		tags: [],
		searchWord: '',
	};
	locals.country = req.session.country;

	//if no country in session
	if(!locals.country || (locals.country == '')){
		req.flash('error', 'Search a country first please.');
	};

	// Load all tags
	view.on('init', function(next) {

		//if no country in session
		if(!locals.country || (locals.country == '')){
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

		//if no country
		if(!locals.country || (locals.country == '')){
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
		//if no country
		if(!locals.country || (locals.country == '')){
		return next();
		};

		if(req.query.search){ // if the URL contains ?search=something : load the specific news 
			locals.data.searchWord = req.query.search;
			//var q = keystone.list('Post').model.find({lang: keystone.lang, $text: {$search: req.query.search,  $caseSensitive: false}}).where({$and:[{'state':'published'}, {'country': locals.country._id}]}).sort('-publishedDate').populate('author tag').limit(10);
			//https://stackoverflow.com/questions/24343156/mongodb-prefix-wildcard-fulltext-search-text-find-part-with-search-string
			var q = keystone.list('Post').model.find({$or: [ {title: {$regex: '.*' + req.query.search + '.*', $options: 'i'}},{'content.extended': {$regex: '.*' + req.query.search + '.*', $options: 'i'}}]}).where({$and:[{'state':'published'}, {'country': locals.country._id}]}).sort('-publishedDate').populate('author tag');
			q.exec(function(err, results) {
				locals.data.posts = results;
				next(err);
			});
		}
		else{

			var q = keystone.list('Post').model.find().where({$and:[{'state':'published'}, {'country': locals.country._id}]}).sort('-publishedDate').populate('author tag');
			
			if (locals.data.tag) {
				q.where('tag').in([locals.data.tag]);
			}
			
			q.exec(function(err, results) {
				locals.data.posts = results;
				next(err);
			});
		}
	});

	// Render the view
	var lang = (req.session.languageselected ? req.session.languageselected.key : 'en');
	view.render(lang + '/site/news');

	
}
