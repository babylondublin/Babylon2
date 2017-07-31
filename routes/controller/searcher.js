var keystone = require('keystone');
var City = keystone.list('City');
exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
	locals = res.locals;
    locals.section = 'searchResults';
    locals.page.title = 'Search Results';

    locals.filters = {
    tag: req.params.tag
    };

    locals.data = {
    articles: [],
    tags: []
    };


    var searchKey = req.query.textbox1;

    view.on('get', { action: 'query' }, function(next) {

        keystone.list('City').model.find({'name':req.body.query}).exec(function(err, result) {
			if(err){
                console.log('error searching');
            } 
            else {
                //Send city data to each controller in order to load articles
                // depending on the city
            return res.sendCityData(); //?
            keystone.search = search;
			next();
		}
        });

    });
     res.redirect("/")
}

