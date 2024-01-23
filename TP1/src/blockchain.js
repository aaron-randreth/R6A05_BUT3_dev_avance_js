import {createBlock, findBlocks, verifyBlocks, findBlock} from "./blockchainStorage.js";
import {json} from "node:stream/consumers"

export async function find_by_id(req, res, url){
    console.log(req)
    return findBlock(url.pathname.split('/').pop())
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
