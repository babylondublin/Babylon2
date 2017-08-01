var keystone = require('keystone');
var Country = keystone.list('Country');
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
    var lowersearchKey = searchKey.toLowerCase();

    view.on('get', { action: 'query' }, function(next) {

        keystone.list('Country').model.find({'name':lowersearchKey}).exec(function(err, result) {
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

