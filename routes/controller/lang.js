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
		res.cookie('lang', keystone.lang);
	}

	var q = keystone.list("Language").model.find({'key': lang});

			q.exec(function(err, result){
				if(result == '' || result == null || err){
				next(err);
				}
				else{

				var result = JSON.stringify(result[0]);
				language = JSON.parse(result);
				req.session.languageselected = language;
				res.cookie('lang', language._id).redirect('/');
			}
		});
	//res.redirect("/");
}