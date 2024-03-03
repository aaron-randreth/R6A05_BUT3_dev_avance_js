import {Livre, LivreFilter} from '../database/models.js'

export async function read_book(req, res){
	res.code(200).send(await Livre.findOne(req.body))
}

const book_array = {
	  type: 'array',
	  items: LivreFilter,
};

export async function read_book_all(req, res) {
	const books = await Livre.find({})
	res.send(books)
}
