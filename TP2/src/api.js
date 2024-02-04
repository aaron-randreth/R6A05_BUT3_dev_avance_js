import {createHash} from 'node:crypto';
import fetch from 'node-fetch'

import 'dotenv/config'

/**
 * Récupère les données de l'endpoint en utilisant les identifiants
 * particuliers developer.marvels.com
 * @param url l'end-point
 * @return {Promise<json>}
 */
export const getData = async (url) => {

    const query_url = new URL(url)
    const timestamp = Date.now().toString();

    const public_key = process.env.PUB_KEY
    const private_key = process.env.PRIV_KEY

    const hash = getHash(public_key, private_key, timestamp)

    query_url.searchParams.append("ts", timestamp)
    query_url.searchParams.append("apikey", public_key)
    query_url.searchParams.append("hash", await hash)

    const response = await fetch(query_url)
    const data = await response.json()

    const heros_with_images = data.data.results.filter(character => !character.thumbnail.path.endsWith("image_not_available"))

    const heros_without_description = heros_with_images.map(character => {
        return {
            name: character.name,  imageUrl: character.thumbnail.path + "." + character.thumbnail.extension,
            description: character.description
        }
    })

    const heros_with_optional_description = heros_without_description.map(character => {
        if (!(typeof character.description === 'string' && character.description.trim() !== ''))
            return {
                name: character.name,
                imageUrl: character.imageUrl,
            };

        return {
            name: character.name,
            imageUrl: character.imageUrl,
            description: character.description
        }
    })

    return heros_with_optional_description
}


/**
 * Calcul la valeur md5 dans l'ordre : timestamp+privateKey+publicKey
 * cf documentation developer.marvels.com
 * @param publicKey
 * @param privateKey
 * @param timestamp
 * @return {Promise<ArrayBuffer>} en hexadecimal
 */
export const getHash = async (publicKey, privateKey, timestamp) => {
    return createHash("md5")
    .update(timestamp + privateKey + publicKey)
    .digest("hex");
}
