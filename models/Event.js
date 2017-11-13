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
    content :{ type: Types.Html, wysiwyg: true, height: 400 },
    color: { type: Types.Select, options: 'orange, red, blue, green, yellow', default: 'orange'},
    country: {type: Types.Relationship, ref: 'Country', index:true}
});


Event.defaultSort = '-publishedDate';
Event.defaultColumns = 'title, date, country, image, content';
Event.register();
