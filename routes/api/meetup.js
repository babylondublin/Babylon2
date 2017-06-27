var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var Meetup = keystone.list('Meetup');


exports = module.exports = function(req, res) {

	var meetupId = req.params.id;

	var rtn = {
		meetup: {},
		attendees: []
	};

	async.series([

		function(next) {
			keystone.list('Meetup').model.findById(meetupId, function(err, meetup) {
				if (err) {
					console.log('Error finding meetup: ', err)
				}
				rtn.meetup = meetup;
				return next();
			});
		}

	], function(err) {
		if (err) {
			rtn.err = err;
		}
		res.json(rtn);
	});
}
