import {Livre} from '../database/models.js'

export async function create_book(req, res){
	const new_book = new Livre(req.body);
	await new_book.save()
	res.code(200).send(new_book)
}
