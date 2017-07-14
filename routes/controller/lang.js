var keystone = require('keystone'),
	moment = require('moment')

var Post = keystone.list('Post')

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
	locals = res.locals;
	
	var lang = req.params.lang;
	if(lang != null){
		if(lang != "fr" && lang != "en" && lang != "pl" && lang != "it" && lang != "es" && lang != "br"){
			lang = "en";
		}
		keystone.lang = lang;
	}
	res.redirect("/");
}
