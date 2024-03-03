import {Livre} from '../database/models.js'

export async function update_book(req, res){
	res.code(200).send(await Livre.updateOne(req.body.filter, req.body.update))
}
