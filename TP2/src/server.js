import {getData} from './api.js'
import Fastify from 'fastify'
const app = Fastify()

app.get('/', async (req, res) => {
  res.headers({'Content-Type': 'application/json'})
  res.code(200)
  res.send(await getData("http://gateway.marvel.com" + "/v1/public/characters"))
})

app.listen({ port: 3000 })
