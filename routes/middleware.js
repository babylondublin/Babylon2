var _ = require('lodash');
var querystring = require('querystring');
var keystone = require('keystone');


/**
	Initialises the standard view locals
*/

exports.initLocals = function(req, res, next) {

	var locals = res.locals;
	

	locals.navLinks = [
		{ label: 'Home',			key: 'home',		   href: '/' },
		{ label: 'Plan Your Trip',	key: 'plan_your_trip', href: '/plan_your_trip' },
		{ label: 'News',			key: 'blog',		   href: '/blog' },
		{ label: 'About',			key: 'about',		   href: '/about'},
		{ label: 'Places to Go',	key: 'places_to_go',   href: '/places_to_go'},
		{ label: 'Living',			key: 'living',		   href: '/living'},
		{ label: 'Things to Do',	key: 'things_to_do',   href: '/things_to_do'},
		{ label: 'Classifieds',		key: 'classifieds',	   href: '/classifieds'}
	];

	locals.user = req.user;

	locals.basedir = keystone.get('basedir');

	locals.page = {
		title: 'Babylon',
		path: req.url.split("?")[0] // strip the query - handy for redirecting back to the page
	};

	locals.qs_set = qs_set(req, res);

	if (req.cookies.target && req.cookies.target == locals.page.path) res.clearCookie('target');

	var bowser = require('../lib/node-bowser').detect(req);

	locals.system = {
		mobile: bowser.mobile,
		ios: bowser.ios,
		iphone: bowser.iphone,
		ipad: bowser.ipad,
		android: bowser.android
	}

	next();

};



/**
	Inits the error handler functions into `req`
*/

exports.initErrorHandlers = function(req, res, next) {
	/*get nav language*/
	/*get nav language*/
	if(keystone.lang == undefined){
		keystone.lang = req.headers["accept-language"].split(',')[0].split("-")[0];		
		if(keystone.lang != "fr" && keystone.lang != "en" && keystone.lang != "pl" && keystone.lang != "it" && keystone.lang != "es" && keystone.lang != "pt"){
			keystone.lang = "en";
		}
		// let it
		// uncomment to set the default value 'en'
		//keystone.lang = "en";
		res.cookie('lang', keystone.lang);
	}
	res.err = function(err, title, message) {
		res.status(500).render(keystone.lang + '/errors/500', {
			err: err,
			errorTitle: title,
			errorMsg: message
		});
	}
	res.notfound = function(title, message) {
		res.status(404).render(keystone.lang + '/errors/404', {
			errorTitle: title,
			errorMsg: message
		});
	}
	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length }) ? flashMessages : false;
	next();
};

/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/signin');
	} else {
		next();
	}
}

/**
	Returns a closure that can be used within views to change a parameter in the query string
	while preserving the rest.
*/

var qs_set = exports.qs_set = function(req, res) {
	return function qs_set(obj) {
		var params = _.clone(req.query);
		for (var i in obj) {
			if (obj[i] === undefined || obj[i] === null) {
				delete params[i];
			} else if (obj.hasOwnProperty(i)) {
				params[i] = obj[i];
			}
		}
		var qs = querystring.stringify(params);
		return req.path + (qs ? '?' + qs : '');
	}
}

/**
	Load the 5 latest news for the news side panel on every pages except the News page.
*/
exports.loadLatestNews = function(req, res, next){
	    var cookie = req.cookies.country;
		//if no Cookie
		if(!cookie || (cookie == '')){
			return next();
		};
		var q = keystone.list('Post').model.find().where({$and:[{'state':'published'}, {'country': cookie}]}).sort('-publishedDate').populate('author').limit(5);	
		q.exec(function(err, results) {
	        if (err) return res.err(err);
	   		 res.locals.lastPosts = results;
	   		 next();
		});
}

/**
	Load the 3 most popular articles
*/
exports.loadPopularNews = function(req, res, next){
	    var cookie = req.cookies.country;
		//if no Cookie
		if(!cookie || (cookie == '')){
			return next();
		};
		var q = keystone.list('Post').model.find().where({$and:[{'state':'published'}, {'country': cookie}]}).sort('-views').populate('author').limit(3);	
		q.exec(function(err, results) {
	        if (err) return res.err(err);
	   		 res.locals.popularPosts = results;
	   		 next();
		});
}

/**
	Load all the countries for the search bar in the header
*/
exports.initCountries = function(req, res, next){
	keystone.list('Country').model.find().exec(function(err, countries) {
			if (err) res.err(err);
			res.locals.countries = countries;
			next();
		});
}

exports.initLanguage = function(req, res, next){
	var query = req.body.query;
	
		if(query && query != ''){
			// https://docs.mongodb.com/manual/reference/operator/query/regex/
			var q = keystone.list("Country").model.find({'name': {$regex: '.*' + query + '.*', $options: 'i'}});

			q.exec(function(err, result){
				if(result == '' || result == null || err){
				req.flash('error', 'The country you have searched doesn not exist in our database yet...');
				view.render(keystone.lang + '/errors/404');
				next(err);
				}
				else{

				// if more than 1 result : we take the first one by default
				var result = JSON.stringify(result[0]);
			/*	result = result.substring(1,result.length);
				result = result.substring(0,result.length-1); */
				country = JSON.parse(result);

				//Temporary alert
				req.flash('info','You are in Babylon <strong>' + country.name +'</strong>');

				//https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client
				res.cookie('country', country._id).redirect('/');
				}
			});
			
		}else{
			next();
		}
	
}