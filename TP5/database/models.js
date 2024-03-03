import mongoose from 'mongoose'

export const Livre = mongoose.model(
	'Livre',
	{
		'title' : {
			type: String,
			require: true
		},
		'author' : {
			type: String,
			require: true
		},
		'desc' : String,
		'format' : {
			type: String,
			enum : ['poche', 'manga',  'audio'],
			default: 'poche'
		}
	}
);

export const LivreFilter = {
	type: 'object',
	properties: {
		title: { type: 'string' },
		author: { type: 'string' },
		desc: { type: 'string' },
		format: { type: 'string', enum: ['poche', 'manga', 'audio'] }
	},
	required: ['title', 'author']
}
