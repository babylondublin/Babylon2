var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Classified Tags Model
 * ===============
 */

var ClassifiedTag = new keystone.List('ClassifiedTag', {
    track: true,
	autokey: { from: 'name', path: 'key', unique: true }
});

ClassifiedTag.add({
	name: { type: String, required: true }
});


/**
 * Relationships
 * =============
 */

ClassifiedTag.relationship({ ref: 'Classified', refPath: 'tags', path: 'classifieds' });


/**
 * Registration
 * ============
 */

ClassifiedTag.register();
