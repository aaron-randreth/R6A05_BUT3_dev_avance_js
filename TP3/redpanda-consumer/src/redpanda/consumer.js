import {Kafka, logLevel} from "kafkajs";
import {getLocalBroker} from "../config/config.js";

const isLocalBroker = getLocalBroker()
const redpanda = new Kafka({
    brokers: [
        isLocalBroker ? `${process.env.HOST_IP}:9092` : 'redpanda-0:9092',
        'localhost:19092'],
});

const consumer = redpanda.consumer({ groupId: 'test-group' })
export const getConnection = async (topic) => {

    try {
        await consumer.connect()
        await consumer.subscribe({ topic: topic, fromBeginning: true })

        console.log("Consumer connecté");

        await consumer.run({
          eachMessage: async ({ topic, partition, message }) => {

          const value = JSON.parse(message.value.toString())

            console.log({
                user: value.user,
                message: value.message,
                timestamp: message.timestamp,
                date: formatDate(message.timestamp)
            })
          },
        })

    } catch (error) {
        console.error("Error:", error);
    }

}

export const disconnect = async () => {
    try {
        await consumer.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
}

function npad(number){
    return String(number).padStart(2, '0')
}

function formatDate(timestamp){
    const d = new Date(Number(timestamp))

    const day = npad(d.getDate())
    const month = npad(d.getMonth() + 1)
    const year = d.getFullYear()

    const hours = npad(d.getHours())
    const minutes = npad(d.getMinutes())

    return day + "/"  + month + "/" + year + " à " + hours + ":" + minutes
}
