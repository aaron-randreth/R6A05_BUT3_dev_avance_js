import * as Admin from "./redpanda/admin.js"
import * as Producer from "./redpanda/producer.js"

import "dotenv/config"

import {getUser} from "./messages/userlist.js";
import {getStringMessage} from "./messages/stringmessages.js";
import {getNumberMessage} from "./messages/numbermessage.js";
import {getNumberWord, getConfigNumber, getDebug, getTimeOut, getTopic, getTypeMessage} from "./config/config.js";

const numberWord = getNumberWord()
const configNumber = getConfigNumber()
const typeMessage = getTypeMessage()
const topic = getTopic()
const debug = getDebug()

console.log(process.env.NUMBER_WORD)

async function start() {

    console.log(`Creating topic: ${topic}`)
    await Admin.createTopic(topic)
    console.log("Connecting...")
    const timeRetour = getTimeOut()

    setInterval(() => {
        const user = getUser()
        const message = typeMessage === "texte" ?
            getStringMessage(numberWord) :
            typeMessage === "nombre" ?
                getNumberMessage(configNumber) :
                "Config Error : choisir 'nombre' ou 'texte'"

        Producer.getConnection(topic, user, message)
        if (debug) {
            console.log({topic, user, message})
        }

    }, timeRetour)
}

start()
