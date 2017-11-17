var keystone = require('keystone'),
	moment = require('moment')


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
				//We use session ir order to use the templates depending on the 
				//language (EN, ES, FR, ...) and handle multiple users at the same time changing the lang.
				req.session.languageselected = language;

				// export this session as a global var and handle it from the jQuery in header and footer,
				//at the controller change cookie for session.lang._id and delete the following res.cookie
				res.cookie('lang', language._id).redirect('/');
			}
		});
	//res.redirect("/");
}