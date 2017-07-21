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
	if(keystone.lang == undefined){
		keystone.lang = req.headers["accept-language"].split(',')[0].split("-")[0];		
		if(keystone.lang != "fr" && keystone.lang != "en" && keystone.lang != "pl" && keystone.lang != "it" && keystone.lang != "es" && keystone.lang != "br"){
			keystone.lang = "en";
		}
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
