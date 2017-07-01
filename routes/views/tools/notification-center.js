var keystone = require('keystone'),
	async = require('async');

var User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'tools';



	// Keep it secret, keep it safe

	if (!req.user || req.user && !req.user.isAdmin) {
		console.warn('===== ALERT =====');
		console.warn('===== A non-admin attempted to access the Notification Center =====');
		return res.redirect('/');
	}


	
	// Notify all Babylon subscribers

	view.on('post', { action: 'notify.subscriber' }, function(next) {
		if (!locals.subscribers) {
			req.flash('warning', 'There aren\'t any subscribers at the moment' );
			return next();
		} else {
			async.each(locals.subscribers, function(subscriber, doneSubscriber) {
				new keystone.Email('member-notification').send({
					subscriber: subscriber,
					subject: req.body.subscriber_email_subject || 'Notification from Babylon',
					content: req.body.subscriber_email_content,
					link_label: req.body.subscriber_email_link_label,
					link_url: req.body.subscriber_email_link_url,
					to: subscriber.email,
					from: {
						name: 'Babylon',
						email: 'hello@babylon.com'
					}
				}, doneSubscriber);
			}, function(err) {
				if (err) {
					req.flash('error', 'There was an error sending the emails, please check the logs for more info.');
					console.error("===== Failed to send subscriber emails =====");
					console.error(err);
				} else {
					req.flash('success', 'Email sent to ' + keystone.utils.plural(locals.subscribers.length, '* subscriber'));
				}
				next();
			});
		}
	});

	
	
	view.render('tools/notification-center');
	
}
