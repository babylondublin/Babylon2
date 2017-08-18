var keystone = require('keystone'),
	async = require('async');

// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_RyP8zBn0CgTRnQUWrYdAvaEu");
var User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'payment';
	locals.page.title = 'Payment - Babylon';
	
	// On POST requests, charge the customer
	view.on('post', { action: 'charge' }, function (next) {

		var customerID;
		var token = req.body.stripeToken; 
		var customerEmail = req.body.stripeEmail;
		var chargeAmount = req.body.chargeAmount;

		// retrieve or create the customer if doesnt exist
 			stripe.customers.retrieve(
			  req.user.customerId,
			  function(err, customer) {
			   		if(customer){ // if the customer already exists on Stripe
			   			customerID = customer.id;
			   			stripe.charges.create({
						  amount: chargeAmount,
						  currency: "eur",
						  description: "Example charge for " + customerEmail,
						  source: token,
						}, function(err, charge) {
							  if(err){
							  	console.log("There is an error : " + err.type);
							  	return res.err(err);
							  }else{
							  	// Use and save the charge info.
						 		User.model.findOneAndUpdate({customerId: customerID}, {$set: {"isPremium": true}}).exec(function(err) {
							   		if(err) {
								      	throw err;
								     }
								});
								console.log("The payment was successful");
								res.redirect("/me");
							  }
						});
			   		}else{
			   			// Create a Customer:
						stripe.customers.create({
						  email: customerEmail,
						  source: token,
						}).then(function(customer) {
							customerID = customer.id;
							//create charges
							  return stripe.charges.create({
							    amount: chargeAmount,
							    currency: "eur",
							    customer: customer.id,
							    description: "Example charge for " + customerEmail,
							  }, function(err, charge){
								  	if(err){
								  		console.log("There is an error : " + err);
								  		return res.err(err);
								  	}else{
								  		// Use and save the charge info.
									   User.model.findOneAndUpdate({email: req.user.email}, {$set: {"isPremium": true, "customerId": customerID }}).exec(function(err) {
									   		if(err) {
										      	throw err;
										     }
										});
									    console.log("Your payment was successful");
									    res.redirect("/me");
								  	}
							  });
						});
			   		}
			  });

		
	});

	// Render the view
	view.render(keystone.lang + '/site/payment');
	
}
