var babelify = require('babelify');
var bodyParser = require('body-parser');
var browserify = require('browserify-middleware');
var clientConfig = require('../client/config');
var keystone = require('keystone');
var middleware = require('./middleware');
var graphqlHTTP = require('express-graphql');
var graphQLSchema = require('../graphql/basicSchema').default;
var relaySchema = require('../graphql/relaySchema').default;
var bodyParser = require('body-parser');

var importRoutes = keystone.importer(__dirname);

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
	res.status(500).render(keystone.lang + '/errors/500', {
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

	// Browserification
	app.get('/js/packages.js', browserify(clientConfig.packages, {
		cache: true,
		precompile: true,
	}));

	app.use('/js', browserify('./client/scripts', {
		external: clientConfig.packages,
		transform: [
			babelify.configure({
				presets: ['es2015', 'react']
			}),
		],
	}));

   	//http://expressjs.com/tr/api.html#req.body
 	app.use(bodyParser.json());
 	// change language
 	app.use("*", middleware.initLanguage);

  // load the countries for the search bar
   app.use('*', middleware.initCountries);

	// GraphQL
	app.use('/api/graphql', graphqlHTTP({ schema: graphQLSchema, graphiql: true }));
	app.use('/api/relay', graphqlHTTP({ schema: relaySchema, graphiql: true }));

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
	//app.get('/members', routes.controller.members);
	//app.get('/members/mentors', routes.controller.mentors);
	//app.get('/member/:member', routes.controller.member);
	//app.get('/organisations', routes.controller.organisations);
	//app.get('/links', routes.controller.links);
	//app.get('/links/:tag?', routes.controller.links);
	//app.all('/links/link/:link', routes.controller.link);
	app.get('/news/:tag?', routes.controller.news);
	app.all('/news/post/:post', routes.controller.post);
	app.get('/plan_your_trip', routes.controller.plan_your_trip);
	//app.get('/showbag', routes.controller.showbag);
	app.all('/about', routes.controller.about);
	app.get('/places_to_go/:tag?', routes.controller.places_to_go);
	app.all('/places_to_go/article/:article', routes.controller.places_to_goOne);

	app.all('/living', routes.controller.living);
    app.all('/things_to_do', routes.controller.things_to_do);
    app.all('/news', routes.controller.news);
    app.all('/city', routes.controller.city);
    app.all('/atraction', routes.controller.atraction);
    app.all('/article', routes.controller.article);
    app.all('/shoppingcentre', routes.controller.shoppingcentre);
    app.all('/otherthingstodo', routes.controller.other_things_to_do);
    app.all('/tags', routes.controller.tags);
    app.all('/festivalparkmuseum', routes.controller.festivalparkmuseum);

	app.all('/classifieds', routes.controller.classifieds);
	app.all('/classifieds/classified/:classified', routes.controller.classified);

	//Static pages
		//Living section
	app.get("/emergency-numbers", (req, res) => { res.render(keystone.lang + '/site/living/emergency-numbers'); });
	app.get("/emergency", (req, res) => { res.render(keystone.lang + '/site/living/emergency'); });
	app.get("/health-agencies", (req, res) => { res.render(keystone.lang + '/site/living/health-agencies'); });
	app.get("/health-insurance", (req, res) => { res.render(keystone.lang + '/site/living/health-insurance'); });
	app.get("/health-services", (req, res) => { res.render(keystone.lang + '/site/living/health-services'); });
	app.get("/general-practitioners", (req, res) => { res.render(keystone.lang + '/site/living/general-practitioners'); });
	app.get("/health-system", (req, res) => { res.render(keystone.lang + '/site/living/health-system'); });
	app.get("/hospitals", (req, res) => { res.render(keystone.lang + '/site/living/hospitals'); });
		//education section
	app.get("/universities-colleges", (req, res) => { res.render(keystone.lang + '/site/education/universities-colleges'); });
	app.get("/come-to-study", (req, res) => { res.render(keystone.lang + '/site/education/come-to-study'); });
	app.get("/diplomas-recognition", (req, res) => { res.render(keystone.lang + '/site/education/diplomas-recognition'); });
	app.get("/irish-education-system", (req, res) => { res.render(keystone.lang + '/site/education/irish-education-system'); });
	app.get("/primary-post-primary-education", (req, res) => { res.render(keystone.lang + '/site/education/primary-post-primary-education'); });
	app.get("/librairies", (req, res) => { res.render(keystone.lang + '/site/education/librairies'); });
	app.get("/language", (req, res) => { res.render(keystone.lang + '/site/education/language'); });
	app.get("/3rd-level-education", (req, res) => { res.render(keystone.lang + '/site/education/3rd-level-education'); });
	app.get("/pre-school-childcare", (req, res) => { res.render(keystone.lang + '/site/education/pre-school-childcare'); });
		//work section
	app.get("/bank-account", (req, res) => { res.render(keystone.lang + '/site/work/bank-account'); });
	app.get("/banks", (req, res) => { res.render(keystone.lang + '/site/work/banks'); });
	app.get("/CV-and-cover-letter", (req, res) => { res.render(keystone.lang + '/site/work/CV-and-cover-letter'); });
	app.get("/recruitment-websites", (req, res) => { res.render(keystone.lang + '/site/work/recruitment-websites'); });
	app.get("/PPS-number", (req, res) => { res.render(keystone.lang + '/site/work/PPS-number'); });
	app.get("/recruitment-companies", (req, res) => { res.render(keystone.lang + '/site/work/recruitment-companies'); });
	app.get("/FAS-training", (req, res) => { res.render(keystone.lang + '/site/work/FAS-training'); });
	app.get("/volunteer-work", (req, res) => { res.render(keystone.lang + '/site/work/volunteer-work'); });


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
