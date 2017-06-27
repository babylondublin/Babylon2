var React = require('react');
var request = require('superagent');
var RSVPStore = require('../stores/RSVPStore');

var HeroApp = React.createClass({

	getInitialState: function() {
		return {
			user: SydJS.user,
			isBusy: false,
		};
	},

	componentDidMount: function() {
		RSVPStore.addChangeListener(this.updateStateFromStore);
	},

	componentWillUnmount: function() {
		RSVPStore.removeChangeListener(this.updateStateFromStore);
	},




});

module.exports = HeroApp;
