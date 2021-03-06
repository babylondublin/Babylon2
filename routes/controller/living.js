var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'living';
	locals.page.title = 'Living - Babyblon';
	locals.filters = {
		tag: req.params.tag
	};
	locals.data = {
		articles: [],
		tags: []
	};
	
	//if no session
	if(!req.session.country || (req.session.country == '')){
		req.flash('error', 'Search a country first please.');
	};

	// Load all tags
	view.on('init', function(next) {
		//if no session
		if(!req.session.country || (req.session.country == '')){
		return next();
		};

		keystone.list('LivingArticleTag').model.find({'language': req.cookies.lang}).sort('name').exec(function(err, results) {
			
			if (err || !results.length) {
				return next(err);
			}
			
			locals.data.tags = results;
			
			// Load the counts for each tag
			async.each(locals.data.tag, function(tag, next) {
				
				keystone.list('LivingArticle').model.count().where('tag').in([tag.id]).exec(function(err, count) {
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
		//if no session
		if(!req.session.country || (req.session.country == '')){
		return next();
		};
		if (req.params.tag) {
			keystone.list('LivingArticleTag').model.findOne({$and:[{'language': req.cookies.lang}, { key: locals.filters.tag }]}).exec(function(err, result) {
				locals.data.tag = result;
				next(err);
			});
		} else {
			next();
		}
		
	});
	
	// Load the articles
	view.on('init', function(next) {
		
		//if no session
		if(!req.session.country || (req.session.country == '')){
		return next();
		};
		var lang = req.cookies.lang;

		var q = keystone.list('LivingArticle').model.find().where({$and:[{'state':'published'}, {'country': req.session.country._id}, {'language': req.cookies.lang}]}).sort('-publishedDate').populate('author tags');
		
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
	view.render(lang + '/site/living');
	
}
