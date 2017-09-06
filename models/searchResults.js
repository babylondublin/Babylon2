/**
 * Created by dorukatalar on 14.07.2017.
 */
var keystone = require('keystone'),
    moment = require('moment')

var Post = keystone.list('Post'),

    exports = module.exports = function(req, res) {

        var view = new keystone.View(req, res),
            locals = res.locals;

        locals.section = 'searchResults';
        locals.page.title = 'Search Results';

        locals.data = {
            classifieds: []
        };
        
        locals.user = req.user;
        
        var searchKey = req.query.textbox1;



        locals.filters = {
            tag: req.params.tag
        };
        locals.data = {
            articles: [],
            tags: []
        };

        // Load all tags
   


        // Load the articles
        // HERE THERE MUST BE A FILTER TO LOAD ONLY THE 'TOURISM' ARTICLES

        view.on('init', function(next) {

            var a = keystone.list('Classified').model.find().where('slug'.toLowerCase(), searchKey.toLowerCase()).sort('-publishedDate').populate('author tags');

            if (locals.data.tag) {
                a.where('tags').in([locals.data.tag]);
            }

            a.exec(function(err, results) {
                locals.data.articles = results;
                next(err);
            });


            console.log("Here is where it starts" + locals.data.articles);

        });
        
        view.on('init', function(next) {

            var c = keystone.list('Article').model.find().where('slug'.toLowerCase(), searchKey.toLowerCase()).sort('-publishedDate').populate('author tags');

            if (locals.data.tag) {
                c.where('tags').in([locals.data.tag]);
            }

            c.exec(function(err, results) {
                locals.data.articles = locals.data.articles.concat(results);
                next(err);
            });



        });
       
        

        
        view.render(keystone.lang + '/site/searchResults');
    }
