import {readFile, writeFile} from 'node:fs/promises';
import {getDate, monSecret} from "./divers.js";
import {NotFoundError} from "./errors.js";
import {createHash} from 'node:crypto';

import { v4 as uuidv4} from 'uuid';


/* Chemin de stockage des blocks */
const path = 'data/blockchain.json'

/**
 * Mes définitions
 * @typedef { id: string, nom: string, don: number, date: string,hash: string} Block
 * @property {string} id
 * @property {string} nom
 * @property {number} don
 * @property {string} date
 * @property {string} string
 *
 */

/**
 * Renvoie un tableau json de tous les blocks
 * @return {Promise<any>}
 */
export async function findBlocks() {
    const content = await readFile(path, {encoding: 'utf-8'})
    return JSON.parse(content)
}

/**
 * Trouve un block à partir de son id
 * @param partialBlock
 * @return {Promise<Block[]>}
 */
export async function findBlock(partialBlock) {
    if (!await verifyBlocks())
        return {integrity: false}

    const blocks = await findBlocks()
    return blocks.findLast(block => block.id === partialBlock.id)
}

/**
 * Trouve le dernier block de la chaine
 * @return {Promise<Block|null>}
 */
export async function findLastBlock() {
    const previous_blocks = await findBlocks()
    
    if (previous_blocks.length == 0)
        return null

    return previous_blocks[previous_blocks.length - 1]
}

function hash(value) {
    return createHash("sha256", monSecret)
            .update(JSON.stringify(value))
            .digest('hex')
}

export async function verifyBlocks() {
    const blocks = await findBlocks()

    let last_idx = -1
    let res = true

    blocks.forEach(block => {
        if (last_idx === -1){
            ++last_idx
            return 
        }

        res = res && block.hash === hash(blocks[last_idx++])
    })

    return res
}

async function init_new_block(name, donation){
   let newBlock = { 
       id: uuidv4(), 
       nom: name,
       don: donation,
       date: getDate(),
    }

    const last_block = await findLastBlock()

    if (last_block != null)
        newBlock.hash = hash(last_block)

    return newBlock
}

/**
 * Creation d'un block depuis le contenu json
 * @param contenu
 * @return {Promise<Block[]>}
 */
export async function createBlock(contenu) {
    const [old_ledger, new_block] = await Promise.all([findBlocks(), init_new_block(contenu.nom, contenu.don)])
    const new_ledger = [...old_ledger, new_block]

    // Wait until we are sure the block was added
    await writeFile(path, JSON.stringify(new_ledger), {encoding:'utf-8'})

    return new_ledger
}

