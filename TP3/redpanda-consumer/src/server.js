import * as Consumer from "./redpanda/consumer.js"

import "dotenv/config"

import {getTopic, getDebug} from "./config/config.js";

const topic = getTopic()
const debug = getDebug()

async function start() {
    Consumer.getConnection(topic)
}

start()
