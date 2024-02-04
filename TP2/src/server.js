import {getData} from './api.js'

import Fastify from 'fastify'

import fastify_view from '@fastify/view'
import handlebars from 'handlebars'

const app = Fastify()

app.register(fastify_view, {
  engine: {
    handlebars : handlebars
  },
  options: {
    partials: {
      header: '/views/partials/header.hbs',
      footer: '/views/partials/footer.hbs'
    }
  } 
})

app.get('/', async (req, res) => {
  //res.headers({'Content-Type': 'application/json'})
  //res.code(200)
  //res.send())
  return res.view('/views/templates/index.hbs', {personnes: await getData("http://gateway.marvel.com" + "/v1/public/characters")})
})

app.listen({ port: 3000 })
