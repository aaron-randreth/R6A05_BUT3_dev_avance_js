import {create_book} from './create.js'
import {read_book, read_book_all} from './read.js'
import {update_book} from './update.js'
import {delete_book} from './delete.js'

import {LivreFilter} from '../database/models.js'

const update_filter =  {
	    type: 'object',
	    properties: {
		            filter: LivreFilter,
		            update: LivreFilter
		        },
	    required: ['filter', 'update']
};

const read_all_filter = {
	type: 'array',
	items: LivreFilter
}

export default async function(fastify, options){
	const path = "/livre"

	fastify.post(path, 
		{ body: LivreFilter, response : {200: LivreFilter} },
	create_book)

	fastify.get(path,
		{response : {200: LivreFilter} },
	read_book)

	fastify.get(path + "s", 
		{response : {200: read_all_filter} },
	read_book_all)

	fastify.put(path, 
		{ body: update_filter , response : {200: LivreFilter} },
	update_book)

	fastify.delete(path, 
		{ body: LivreFilter, response : {200: LivreFilter} },
	delete_book)
}
