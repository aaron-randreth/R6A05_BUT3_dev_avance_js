import {readFile} from 'node:fs/promises'

try {
	const filePath = new URL('../package.json', import.meta.url)
	const contents = await readFile(filePath, {encoding: 'utf8'})
	console.log(contents)
	console.log("Bonjour à tous!")
} catch (err) {
	console.error(err.message)
}
