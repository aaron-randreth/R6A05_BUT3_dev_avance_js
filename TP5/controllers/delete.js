import {Livre} from '../database/models.js'

export async function delete_book(req, res){
	await Livre.deleteOne(req.body)
	res.code(200).send()
}
