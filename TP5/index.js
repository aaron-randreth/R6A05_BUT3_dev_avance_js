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

