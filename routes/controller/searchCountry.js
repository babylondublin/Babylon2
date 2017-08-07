var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var query = req.body.query;
	var cookie = req.cookies.cookieCountry;

	// https://docs.mongodb.com/manual/reference/operator/query/regex/
	var q = keystone.list("Country").model.find({'name': {$regex: '.*' + query + '.*', $options: 'i'}});

	q.exec(function(err, result){
		if(result == ''){
		console.log('The country you have searched doesn not exist in our database yet...')
		}
		else{
		console.log(result);

		//extract the 'name' from results
		//var countryName = result.name; or result['name'];-> doesn't work
		//console.log(countryName);

		//https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client
		res.cookie('country', result).redirect("/");
		}
	});
}