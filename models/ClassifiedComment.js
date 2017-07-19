var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Classifieds Comments Model
 * ===================
 */

var ClassifiedComment = new keystone.List('ClassifiedComment', {
	nocreate: true
});

ClassifiedComment.add({
	classified: { type: Types.Relationship, ref: 'Classified', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	date: { type: Types.Date, default: Date.now, index: true },
	content: { type: Types.Markdown }
});


/**
 * Registration
 * ============
 */

ClassifiedComment.defaultColumns = 'classified, author, date|20%';
ClassifiedComment.register();
