var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Events Model
 * ===========
 */

var Event = new keystone.List('Event', {
	map: { name: 'title' },
	track: true,
	autokey: { path: 'slug', from: 'title', unique: true }
});

Event.add({
    title: { type: String, required: true },
    date: Date,
    image: { type: Types.CloudinaryImage },
    content :{ type: Types.Html, wysiwyg: true, height: 400 }
});


Event.defaultSort = '-publishedDate';
Event.defaultColumns = 'title, date, image, content';
Event.register();
