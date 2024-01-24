import {createBlock, findBlocks, verifyBlocks, findBlock} from "./blockchainStorage.js";
import {json} from "node:stream/consumers"
import {parse} from 'url';

export async function find_by_id(req, res, url){
    const id = parse(req.url, true).query.id
    return findBlock(id)
}

export async function verify(){
    return verifyBlocks()
}

export async function liste(req, res, url) {
    return findBlocks()
}

export async function create(req, res) {
    return createBlock(await json(req))
}
