var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
	locals = res.locals;
	
	var query = req.body.query;
	console.log(query);
	
	var q = keystone.list("City").model.find().where('name', query);

	q.exec(function(err, result){
		console.log(result);
	});
		

	res.redirect("/");
}