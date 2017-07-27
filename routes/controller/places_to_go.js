var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'places_to_go';
	locals.page.title = 'Places to Go - Babyblon';
	locals.filters = {
		tag: req.params.tag
	};
	locals.data = {
		articles: [],
		tags: []
	};
	
	// Load all tags
	view.on('init', function(next) {
		//filter what tags you wanna show
		keystone.list('ArticleTag').model.find({
										'name':{ $in:[
											'Cliffs of Moher',
											'Dublin Zoo',
											'Powerscourt'
											]}
											}).sort('name').exec(function(err, results) {
			
			if (err || !results.length) {
				return next(err);
			}
			
			locals.data.tags = results;
			
			// Load the counts for each tag
			async.each(locals.data.tag, function(tag, next) {
				
				keystone.list('Article').model.count().where('tag').in([tag.id]).exec(function(err, count) {
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
		
		if (req.params.tag) {
			keystone.list('ArticleTag').model.findOne({ key: locals.filters.tag }).exec(function(err, result) {
				locals.data.tag = result;
				next(err);
			});
		} else {
			next();
		}
		
	});
	
	// Load the articles
	view.on('init', function(next) {
		// Load the Articles Published and for 'Places to Go'
		var q = keystone.list('Article').model.find().where({'state':'published','menu':'places_to_go'}).sort('-publishedDate').populate('author tags');
		
		if (locals.data.tag) {
			q.where('tags').in([locals.data.tag]);
		}
		
		q.exec(function(err, results) {
			locals.data.articles = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render(keystone.lang + '/site/places_to_go');
	
}
