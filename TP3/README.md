# Rapport 

# Étape 1 

## Utilisation du fichier .env pour toute la configuration 

Pour que le projet utilise le fichier `.env` dans toutes ses options de
configuration, j'ai modifié le fichier `config.js` et `server.js`.

J'ai rajouté une fonction dans `config.js` qui récupère la valeur de
`NUMBER_WORD` depuis `.env`.

**src/redpanda/config.js**

```Js
export const getNumberWord = () => {
    return process.env.NUMBER_WORD
}
```

J'ai ensuite modifié `server.js` pour que cela utilise la fonction
`getNumberWord` de `config.js`.

**src/server.js**

```Js

const numberWord = getNumberWord()

//...

getStringMessage(numberWord) :
```

## Configuration du cluster redpanda 

Pour que le producer puisse trouver le cluster redpanda, j'ai modifié le fichier
`.env`.

```
HOST_IP=redpanda-0
```

## Mise en place de l'infrastructure docker 

Pour mettre en place redpanda pour le projet, j'ai copié le fichier
docker-compose.yaml de redpanda donné dans leur documentation. J'ai ensuite
démaré les containers redpanda avec:

```js 
docker compose up -d 
```

j'ai modifié le `package.json` pour rajouter un script nommé "docker".

```js 
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js",
    "docker": "docker build --tag red-panda-producer  . && docker run --volume=./.env:/home/node/app/.env --network=redpanda-quickstart_redpanda_network red-panda-producer"
  },
```

qui permet de créer une image de redpanda-producer, et de lancer un contener de cette image.

Je peux ainsi utiliser la commande 

```Js
npm run docker
```

pour lancer mon projet.

Le producer affiche les méssage qu'il génère sous le format:

```
{ topic: 'mon-super-topic', user: 'Floki', message: 'sit' }
```

# Étape 2 

J'ai remoné le fichié `src/redpanda/producer.js` en
`src/redpanda/consumer.js`. Je l'ai ensuite modifié, pour consommer les
messages. Pour cela, j'ai récupéré la fonction à partir de la documentation de
kafka.

**src/redpanda/consumer.js: **

```Js
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
```

J'ai aussi modifié le fichier `src/server.js`, en supprimant le code lié à la
génération de message. Le serveur ne fait plus qu'appeler getConnection.

----

J'ai créé une méthode pour formatter la date, en transformant le timestamp UINX
en une instance de date.

```Js
function formatDate(timestamp){
    const d = new Date(Number(timestamp))

    const day = npad(d.getDate())
    const month = npad(d.getMonth() + 1)
    const year = d.getFullYear()

    const hours = npad(d.getHours())
    const minutes = npad(d.getMinutes())

    return day + "/"  + month + "/" + year + " à " + hours + ":" + minutes
}
```

---- 

Le consumer affiche les messages du cluster redpanda sous le format:

```
{
  user: 'Astrid',
  message: 'labore',
  timestamp: '1708422835993',
  date: '20/02/2024 à 09:53'
}
```
