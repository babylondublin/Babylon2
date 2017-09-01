var keystone = require('keystone');

exports = module.exports = function(req, res, next) {

	var view = new keystone.View(req, res),
		query = req.body.query;
	if(query == '' || query == null){
		req.flash('error','Search some country.');
		console.log('Search some country');
		return next();
	}
	// https://docs.mongodb.com/manual/reference/operator/query/regex/
	var q = keystone.list("Country").model.find({'name': {$regex: '.*' + query + '.*', $options: 'i'}});

	q.exec(function(err, result){
		if(result == '' || result == null || err){
		req.flash('error', 'The country you have searched doesn not exist in our database yet...');
		view.render(keystone.lang + '/errors/404');
		}
		else{
		var result = JSON.stringify(result);
		result = result.substring(1,result.length);
		result = result.substring(0,result.length-1);
		country = JSON.parse(result);

		//Temporary alert
		req.flash('info','You are in Babylon <strong>' + country.name +'</strong>');

		//https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client
		res.cookie('country', country._id).redirect('/');
		}
	});
}