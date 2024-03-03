# Étape 1 

J'ai suivit les instructions pour installer MongoDB sur ma machine.

![](https://md.roflcopter.fr/uploads/b6b0b784-ca34-42d0-b27b-4273cccd171c.png)
![](https://md.roflcopter.fr/uploads/6e9484c4-3386-4860-aaf7-760b387d440a.png)
![](https://md.roflcopter.fr/uploads/83ef65ca-4775-4faf-8e3c-273247e86c2a.png)

Une fois installé, j'ai vérifié que mon instance de mongodb fonctionnnait bien avec en tapant `show dbs` dans `mongosh`.

![Vérif installation](https://md.roflcopter.fr/uploads/eb24366e-6d7c-4a0d-9452-d34d0cc0ea9e.png)

# Étape 2 

J'ai créé un modèle avec mongoose pour représenter les livres.

```Js
import mongoose from 'mongoose'

export const Livre = mongoose.model(
	'Livre',
	{
		'title' : {
			type: String,
			require: true
		},
		'author' : {
			type: String,
			require: true
		},
		'desc' : String,
		'format' : {
			type: String,
			enum : ['poche', 'manga',  'audio'],
			default: 'poche'
		}
	}
);
```

Comme recommandé dans l'énnoncé, j'ai extrait ma fonction de connection dans un fichier séparé. J'ai aussi utilisé la librairie `dotenv` pour configurer les paramètres de ma base de donnée.

mon fichier `database/connection.js`: 

```
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config()

const db_host = process.env.DB_HOST;
const db_port = process.env.DB_PORT;
const db_name = process.env.DB_NAME;

const db_url = `mongodb://${db_host}:${db_port}/${db_name}`;

export async function db_connect() {
	return mongoose.connect(db_url)
}
```

J'ai ensuite vérifié le bon fonctionnement du lien entre mon code et ma BD en effectuant une lecture simple.

![](https://md.roflcopter.fr/uploads/d18c80f6-3fdb-4b04-887f-350bb614ac3c.png)


## Https 

Je génère ma clef privée et mon certificat de serveur avec une seule commande.

![Gen de certificat + clef privée](https://md.roflcopter.fr/uploads/17acbd9b-e9a1-4013-9816-ff83e621af70.png)


![verif de certif](https://md.roflcopter.fr/uploads/ceb61396-792f-4264-a848-67fe51acc22d.png)

Je configure ensuite fastify pour utiliser l'https grâce à ces fichiers.

```js
const server = fastify({
	    logger: true,
	    http2: true,
	    https: {
		    allowHTTP1: true,
		    key: readFileSync(path.join(__dirname, 'https', 'server.key')),
		    cert: readFileSync(path.join(__dirname, 'https', 'server.cert'))
	  }
```

# Étape 3 

## Configuration des routes 

J'ai créé quatres fichiers js, avec chacun un handler pour implementer les opérations CRUD.

Exemple de fichier crud `delete.js` : 

```Js
import {Livre} from '../database/models.js'

export async function delete_book(req, res){
	await Livre.deleteOne(req.body)
	res.send()
}
```

J'ai ensuite créé un fichier crud.js, qui enregistre les différentres routes. La fonction par défaut de ce module, est un plugin fastify.

`Crud.js`: 

```Js

export default async function(fastify, options){
	const path = "/livre"

	fastify.post(path, 
		{ body: LivreFilter, response : {200: LivreFilter} },
	create_book)

    //..

	fastify.delete(path, 
		{ body: LivreFilter, response : {200: LivreFilter} },
	delete_book)
}
```

J'enregistre ensuite ce plugin dans mon `index.js`: 

```Js
import {readFileSync} from "node:fs"
import path from "node:path"
import { fileURLToPath } from 'url';

import fastify from 'fastify';

import {db_connect} from './database/connection.js'
import routes from './controllers/crud.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = fastify({
	    logger: true,
	    http2: true,
	    https: {
		    allowHTTP1: true,
		    key: readFileSync(path.join(__dirname, 'https', 'server.key')),
		    cert: readFileSync(path.join(__dirname, 'https', 'server.cert'))
	  }
})



// Start the server
const start = async () => {
	try {
		await db_connect()
		server.register(routes)
		server.listen({ port: 3000, listenTextResolver: (address) => { return `Server is listening at ${address}` } })
		console.log('Server is running on http://localhost:3000');
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

start();


```

## Validation des I/O 

Pour m'assuer des la validité des I/O, j'ai utilisé la fonctionnalité de schéma de fastify.

J'ai tout d'abord créé plusieurs schéma fastify pour filtrer les I/O.

```Js
export const LivreFilter = {
	type: 'object',
	properties: {
		title: { type: 'string' },
		author: { type: 'string' },
		desc: { type: 'string' },
		format: { type: 'string', enum: ['poche', 'manga', 'audio'] }
	},
	required: ['title', 'author']
}
```

J'ai ensuite enregistré ces schéma lors de la définition des routes dans `crud.js`: 

```Js
	//fastify.post(path, 
		{ body: LivreFilter, response : {200: LivreFilter} },
	//create_book)
```