import {getData} from './api.js'

(async () => { 
    const personnes = await getData("http://gateway.marvel.com" + "/v1/public/characters")
    console.log(personnes)
})()
