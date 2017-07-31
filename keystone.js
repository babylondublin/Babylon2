// Load the babel-register plugin for the graphql directory
// Note this checks the regex against an absoloute path
require('babel-register')({ only: /\/graphql\/.*/ });

// Load .env config for development environments
require('dotenv').config({ silent: true });

// Initialise New Relic if an app name and license key exists
if (process.env.NEW_RELIC_APP_NAME && process.env.NEW_RELIC_LICENSE_KEY) {
	require('newrelic');
}

/**
 * Application Initialisation
 */
// Require keystone
var keystone = require('keystone');
var pkg = require('./package.json');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.
keystone.init({

	'name': 'Babylon',
	'brand': 'Babylon',
	'back': '/me',

	'favicon': 'public/favicon.ico',
	'less': 'public',
	'static': 'public',

	'views': 'templates/views',
	'view engine': 'pug',
	'view cache': false,

	'emails': 'templates/emails',

	'auto update': true,
	'mongo': process.env.MONGO_URI || 'mongodb://localhost/' + pkg.name,

	'session': true,
	'session store': 'mongo',
	'auth': true,
	'user model': 'User',
	'cookie secret': process.env.COOKIE_SECRET || 'sydjs',

	'mandrill api key': process.env.MANDRILL_KEY,

	'google api key': process.env.GOOGLE_BROWSER_KEY,
	'google server api key': process.env.GOOGLE_SERVER_KEY,

	'ga property': process.env.GA_PROPERTY,
	'ga domain': process.env.GA_DOMAIN,

	'basedir': __dirname,

	'wysiwyg override toolbar': false,
	'wysiwyg menubar': true,
	'wysiwyg skin': 'lightgray',

	'wysiwyg additional buttons': 'searchreplace visualchars,'
 		+ ' charmap ltr rtl pagebreak paste, forecolor backcolor,'
 		+' emoticons media, preview print ',
	'wysiwyg additional plugins': 'table, advlist, anchor,'
	 	+ ' autolink, autosave, charmap, contextmenu, '
 		+ ' directionality, emoticons, fullpage, hr, media, pagebreak,'
 		+ ' paste, preview, print, searchreplace, textcolor,'
 		+ ' visualblocks, visualchars, wordcount, legacyoutput',
	'wysiwyg images': true,
});

// Load your project's Models
keystone.import('models');

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	moment: require('moment'),
	js: 'javascript:;',
	env: keystone.get('env'),
	utils: keystone.utils,
	plural: keystone.utils.plural,
	editable: keystone.content.editable,
	google_api_key: keystone.get('google api key'),
	ga_property: keystone.get('ga property'),
	ga_domain: keystone.get('ga domain')
});

keystone.set('email locals', {
	utils: keystone.utils,
	host: (function() {
		if (keystone.get('env') === 'staging') return 'http://sydjs-beta.herokuapp.com';
		if (keystone.get('env') === 'production') return 'http://www.sydjs.com';
		return (keystone.get('host') || 'http://localhost:') + (keystone.get('port') || '3000');
	})()
});

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	'babylonians': 'users',
	'cities':'cities',
	// Article tags => articles sub menu
	'places-to-go':['places-to-go-articles','places-to-go-article-tags','places-to-go-article-comments'],
	'things-to-do':['things-to-do-articles','things-to-do-article-tags','things-to-do-article-comments'],
	'living':['living-articles','living-article-tags','living-article-comments'],
	'news': ['posts', 'post-tags', 'post-comments'],
	'classifieds':['classifieds', 'classified-tags','classified-comments'],
	'enquiries': 'enquiries',

});

keystone.start();
