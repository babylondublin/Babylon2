var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'plan_your_trip';
	locals.page.title = 'Plan your trip - Babyblon';
	locals.filters = {
		tag: req.params.tag
	};
	locals.data = {
		articles: [],
		tags: []
	};

	var country = req.session.country;
	
	//if no country
	if(!country || (country == '')){
		req.flash('error', 'Search a country first please.');
	};

	// Load all tags
	view.on('init', function(next) {

		//if no country
		if(!country || (country == '')){
		return next();
		};

		keystone.list('PlanYourTripArticleTag').model.find({'language': req.cookies.lang}).sort('name').exec(function(err, results) {
			
			if (err || !results.length) {
				return next(err);
			}
			
			locals.data.tags = results;
			
			// Load the counts for each tag
			async.each(locals.data.tag, function(tag, next) {
				
				keystone.list('PlanYourTripArticle').model.count().where('tag').in([tag.id]).exec(function(err, count) {
					tag.articleCount = count;
					next(err);
				});
				
			}, function(err) {
				next(err);
			});
			
		});
		
	});
	
	// Load the current tagfilter
	view.on('init', function(next) {

		//if no coutnry
		if(!country || (country == '')){
		return next();
		};

		if (req.params.tag) {
			keystone.list('PlanYourTripArticleTag').model.findOne({$and:[{'language': req.cookies.lang}, { key: locals.filters.tag }]}).exec(function(err, result) {
				locals.data.tag = result;
				next(err);
			});
		} else {
			next();
		}
		
	});
	
	// Load the articles
	view.on('init', function(next) {
		//if no coutrny
		if(!country || (country == '')){
		return next();
		};
		
		var q = keystone.list('PlanYourTripArticle').model.find().where({$and:[{'state':'published'}, {'country': country._id}, {'language': req.cookies.lang}]}).sort('-publishedDate').populate('author tags');
		
		if (locals.data.tag) {
			q.where('tags').in([locals.data.tag]);
		}
		
		q.exec(function(err, results) {
			locals.data.articles = results;
			next(err);
		});
		
	});
	
	// Render the view
	var lang = (req.session.languageselected ? req.session.languageselected.key : 'en');
	view.render(lang + '/site/plan_your_trip');
	
}
