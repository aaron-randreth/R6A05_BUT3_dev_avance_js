# Serveur NodeJS : Charité & Blockchain

- Permet d'enregistrer les dons de donnateur en utilisant le principe de la Blockchain
- L'API REST répond aux  verbes `GET` et `POST`
- La sauvegarde des dons s'effectue dans le fichier `blockchain.json`
- Tous les traitements s'effectuent en asynchrone à travers des `Promises`.
- `npm run reset` permet de réinitialiser la Blockchain

- [Description de l'API](#Description de l'API)
- [Compte rendu](#Compte rendu)

## Description de l'API

* Le serveur écoute sur le port `3000`
* le Endpoint est `/blockchain`

### GET

#### Lister tous les Dons

```shell
curl --request GET 'http://localhost:3000/blockchain'
```

#### Verifier l'intégrité de la Blockchain 

```sh
curl -X GET 'http://localhost:3000/blockchain/integrity'
```

#### Trouver un block avec son id

```sh
curl -X GET 'http://localhost:3000/blockchain/block?id=uuid'
```

### POST

#### Créer un nouveau bloc. 

Sa composition est fourni en json :
`{
"nom": "Nom de la personne",
"don": 1234
}`

L'identifiant du don est généré automatiquement au format uuid. La date (`timestamp`) est mise
au format `aaaammjj-hh:mm:ss` insérés à la réception du don. Une valeur de hachage est
calculée avec l'algorithme **sha256** à partir du bloc précédent. Pour le premier bloc,
la valeur `hash` est déterminée à partir de la variable `unSecret`.

```shell
curl --request POST 'http://localhost:3000/blockchain' --header 'Content-Type: application/json' --data-raw '{
   "nom": "Alan Turing",
   "don": 4567
}'
```
L'enregistrement résultant pourrait ressemble à ceci :
`{
"id": "0b05ea1c-a17f-411a-9bb6-c31130b3e212",
"nom": "Alan Turing",
"don": 4567,
"date": "20230802-16:31:30",
"hash": "b28c94b2195c8ed259f0b415aaee3f39b0b2920a4537611499fa044956917a21"
}`

## Compte rendu

### Travail effectué

Pendant ce TP, j'ai implémenté toutes les fonctions requises pour les étapes 1 à
4. Quant à la section bonus, j'ai complété intégralement la fonction
`verifBlocks` et j'ai réalisé les fonctionnalités principales de
`findBlock(id)`. Cependant, je n'ai pas achevé, la gestion des arguments pour
récupérer l'identifiant depuis les paramètres HTTP pendant le TP, mais je l'ai
finalisée ultérieurement.

### Ce que j'ai appris

Ce TP m'a permis de découvrir l'utilisation des asynchrones en JavaScript. J'ai
acquis une compréhension des `Promise`s ainsi que des mots-clés `await` et
`async`. À noter que précédemment, lors de ma SAE, j'ai également eu l'occasion
d'explorer la programmation asynchrone en Java en utilisant l'API
`CompletableFuture`. J'ai observé des similitudes dans la logique de code,
notamment avec des syntaxes telles que `.then()` ou `catch()`, qui sont assez
semblables. Les mots-clés natifs `async` et `await` en JavaScript rendent le
code plus lisible et seraient une addition bienvenue en Java.

### Mes choix

Pour la réalisation de ce TP, j'ai préféré utiliser `async` et `await` pour leur
simplicité d'utilisation, par rapport à l'utilisation directe des méthodes `resolve` et
`reject` avec le callback de `Promise`. Toutefois, j'ai également fait appel à
certaines méthodes de l'API, comme `Promise.all()`, lorsque les opérations
n'étaient pas interdépendantes.

```Js
const [old_ledger, new_block] = await Promise.all([findBlocks(), init_new_block(contenu.nom, contenu.don)])
```

Concernant l'optimisation de la vitesse, je n'ai pas modifié la signature des
méthodes dans blockchainStorage afin de respecter les directives du TP. J'ai
utilisé ces méthodes directement pour créer d'autres méthodes. Comme ici avec
`findBlock(id)` qui utilise `findBlocks` et `verifyBlocks`.

```Js
export async function findBlock(id) {
    const blocks = await findBlocks()
    const res = blocks.findLast(block => block.id === id)

    if (res == null)
        return null

    res.integrity = await verifyBlocks()

    return res
}
```

Bien que cela implique des opérations redondantes, comme la lecture du
fichier, dont les performances sont affectées par les entrées-sorties (I/O)
lentes. `findBlocks` et `verifyBlocks` par exemple récupèrent tous les deux les mêmes
informations, mais font deux opérations de lecture de fichier différentes.
Ces considérations ne me semblaient cependant pas primordiales compte tenu de
l'échelle du projet. 
