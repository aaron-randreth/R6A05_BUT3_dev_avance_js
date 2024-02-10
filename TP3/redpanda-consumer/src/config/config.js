import 'dotenv/config'

export const getTimeOut = () => {
    return Number(process.env.PERIODE_MS) || 5000

}

export const getTopic = () => {
    return process.env.TOPIC || "topic-test"
}

export const getDebug = () => {
    return process.env.DEBUG === "true"
}

export const getLocalBroker = () => {
    return process.env.HOST_IP !== ""
}
