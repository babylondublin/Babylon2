var bodyParser = require('body-parser');
var keystone = require('keystone');
var middleware = require('./middleware');

var importRoutes = keystone.importer(__dirname);
var bodyParser = require('body-parser');

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', middleware.flashMessages);

// Handle 404 errors
keystone.set('404', function (req, res, next) {
	res.notfound();
});

// Handle other errors
keystone.set('500', function (err, req, res, next) {
	var title, message;
	if (err instanceof Error) {
		message = err.message;
		err = err.stack;
	}
	res.status(500).render( keystone.lang + '/errors/500', {
		err: err,
		errorTitle: title,
		errorMsg: message
	});
});

// Load Routes
var routes = {
	api: importRoutes('./api'),
	controller: importRoutes('./controller'),
	auth: importRoutes('./auth'),
};

// Bind Routes
exports = module.exports = function (app) {

 	//http://expressjs.com/tr/api.html#req.body
 	app.use(bodyParser.json());
 	// Search country
 	app.use("*", middleware.searchCountry);	

	// Load the 5 latest news for the news side panel	
	app.use('*', middleware.loadLatestNews);
	// Load the 3 most popular news
	app.use('*', middleware.loadPopularNews);
	// load the countries for the search bar
	app.use('*', middleware.initCountries);
	// load all Tags and Articles to the Nav Bar
	app.use('*', middleware.loadTags);
	app.use('*', middleware.allArticles);


	// Allow cross-domain requests (development only)
	if (process.env.NODE_ENV !== 'production') {
		console.log('------------------------------------------------');
		console.log('Notice: Enabling CORS for development.');
		console.log('------------------------------------------------');
		app.all('*', function (req, res, next) {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Methods', 'GET, POST');
			res.header('Access-Control-Allow-Headers', 'Content-Type');
			next();
		});
	}

	// Website
	app.get('/', routes.controller.index);
	//app.get('/meetups', routes.controller.meetups);
	//app.get('/meetups/:meetup', routes.controller.meetup);
	app.get('/countries', routes.controller.countries);	
	app.get('/members', routes.controller.members);
	//app.get('/members/mentors', routes.controller.mentors);
	app.get('/member/:member', routes.controller.member);
	//app.get('/organisations', routes.controller.organisations);
	//app.get('/links', routes.controller.links);
	//app.get('/links/:tag?', routes.controller.links);
	//app.all('/links/link/:link', routes.controller.link);
	//app.get('/showbag', routes.controller.showbag);
	app.get('/news/:tag?', routes.controller.news);
	app.all('/news/post/:post', routes.controller.post);

	//app.all('/search', routes.controller.searchCountry);

	app.all('/about', routes.controller.about);
	app.all('/contactUs', routes.controller.contactUs);
	app.all('/joinTheTeam', routes.controller.joinTheTeam);

	//app.get('/places_to_go/:tag?', routes.controller.places_to_go);
	app.all('/places_to_go/:tag/:article', routes.controller.places_to_goOne);
	//app.get('/things_to_do/:tag?', routes.controller.things_to_do);
	app.all('/things_to_do/:tag/:article', routes.controller.things_to_doOne);
	//app.get('/living/:tag?', routes.controller.living);
	app.all('/living/:tag/:article', routes.controller.livingOne);

	//app.get('/plan_your_trip/:tag?', routes.controller.plan_your_trip);
 	app.all('/plan_your_trip/:tag/:article', routes.controller.plan_your_tripOne);
  
	app.all('/payment', routes.controller.payment);

	app.all('/classifieds', routes.controller.classifieds);
	app.get('/classifieds/:tag?',routes.controller.classifieds);
	app.all('/classifieds/classified/:classified', routes.controller.classified);
	app.get('/events',routes.controller.events);
	app.get('/events/event/:event',routes.controller.event);
	
	//Radio player
	app.get('/radioplayer',routes.controller.radioplayer);

	// Session
	app.all('/join', routes.controller.session.join);
	app.all('/signin', routes.controller.session.signin);
	app.get('/signout', routes.controller.session.signout);
	app.all('/forgot-password', routes.controller.session['forgot-password']);
	app.all('/reset-password/:key', routes.controller.session['reset-password']);

	// Authentication
	app.all('/auth/confirm', routes.auth.confirm);
	app.all('/auth/app', routes.auth.app);
	app.all('/auth/:service', routes.auth.service);

	// User
	app.all('/me*', middleware.requireUser);
	app.all('/me', routes.controller.me);
	//app.all('/me/create/post', routes.controller.createPost);
	//app.all('/me/create/link', routes.controller.createLink);
	app.all('/me/create/classified', routes.controller.createClassified);
	app.all('/me/create/post', routes.controller.createPost);

	// Tools
	app.all('/notification-center', routes.controller.tools['notification-center']);

	// API
	app.all('/api*', keystone.middleware.api);


	// API - App
	app.all('/api/app/signin-email', routes.api.app['signin-email']);
	app.all('/api/app/signup-email', routes.api.app['signup-email']);
	app.all('/api/app/signin-service', routes.api.app['signin-service']);
	app.all('/api/app/signin-service-check', routes.api.app['signin-service-check']);
	app.all('/api/app/signin-recover', routes.api.app['signin-recover']);

	/**lang changer**/
	app.get('/lang', routes.controller.index);
	app.get('/lang/:lang', routes.controller.lang);

}
