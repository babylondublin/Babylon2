var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'classifieds';
	locals.page.title = 'Classifieds - Babyblon';
	locals.filters = {
		tag: req.params.tag
	};
	locals.data = {
		classifieds: [],
		tags: []
	};
	locals.country = req.session.country;

	//if no country in session
	if(!locals.country || (locals.country == '')){
		req.flash('error', 'Search a country first please.');
	};

	// Load all tags
	view.on('init', function(next) {
		
		//if no session
		if(!locals.country || (locals.country == '')){
		return next();
		};

		keystone.list('ClassifiedTag').model.find().sort('name').exec(function(err, results) {
			
			if (err || !results.length) {
				return next(err);
			}
			
			locals.data.tags = results;
			
			// Load the counts for each tag
			async.each(locals.data.tag, function(tag, next) {
				
				keystone.list('Classified').model.count().where('tag').in([tag.id]).exec(function(err, count) {
					tag.classifiedCount = count;
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
		if(!locals.country || (locals.country == '')){
		return next();
		};

		if (req.params.tag) {
			keystone.list('ClassifiedTag').model.findOne({ key: locals.filters.tag }).exec(function(err, result) {
				locals.data.tag = result;
				next(err);
			});
		} else {
			next();
		}
		
	});
	
	// Load the classifieds
	view.on('init', function(next) {
		//if no session
		if(!locals.country || (locals.country == '')){
		return next();
		};

		var q = keystone.list('Classified').model.find().where({$and:[{'state':'published'}, {'country': locals.country._id}]}).sort('-publishedDate').populate('author tag');
		
		if (locals.data.tag) {
			q.where('tag').in([locals.data.tag]);
		}
		
		q.exec(function(err, results) {
			locals.data.classifieds = results;
			next(err);
		});
		
	});
	
	// Render the view
	var lang = (req.session.languageselected ? req.session.languageselected.key : 'en');
	view.render(lang + '/site/classifieds');

}
