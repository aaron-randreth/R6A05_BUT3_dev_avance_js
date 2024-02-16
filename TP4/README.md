# Rapport 

## Étape 1 

### Test des différents chemins 

Pour débuter le TP, j'ai testé les différents chemins disponible sur le projet. Pour cela j'ai utilisé POSTMAN afin d'effectuer les requêtes.

![screenshot du lancement du projet node en CLI](https://md.roflcopter.fr/uploads/d488688d-3d3f-4ee0-a17a-b8dbfe9a1597.png)
**Figure 1: Lancement du projet node.**

----

Les premières requêtes que j'ai envoyé n'étaient pas authentifiées. J'ai donc reçu le message de refu "Tu ne sais rien, John Snow" lorsque j'ai essayé d'acceder à la route `/secu`.

![screenshot de requête postman sans authentification sur /secu](https://md.roflcopter.fr/uploads/a3a28389-42bf-4755-8aec-65ea5c543978.png)
**Figure 2: Requête sans authentification sur /secu.**

![screenshot de requête postman sans authentification sur /dmz](https://md.roflcopter.fr/uploads/f9b7a313-9255-4090-b282-452ac1610d4f.png)
**Figure 3: Requête sans authentification sur /dmz.**

----

Pour une authentification basique avec le protocole http, il faut encoder une chaine de caractère contenant "[nom d'utilisateur]:[mot de passe]" en base64. J'ai créé une clef en utilisant un site web qui encode des chaines des caractères. 

![screenshot de requête postman sans authentification sur /dmz](https://md.roflcopter.fr/uploads/db431124-f293-4bb4-9994-4de9a3d0ef4a.png)
**Figure 4: Création de la clef d'authentification basique.**

J'ai ensuite manuellement rajouté un header `Authorization`, avec pour valeur "Basic [clef d'authentification]". J'ai testé la route `/secu`, qui a renvoyé la réponse de réussite "Un Lannister paye toujours ses dettes !".

![Auth Header manuel](https://md.roflcopter.fr/uploads/a32c42df-d578-4c0a-88bf-a944a188d6e8.png)
**Figure 5: Requête authentifié sur la route /secu.**

----

Postman peut faciliter le processus, en nous évitant d'avoir à encoder manuellement notre clef. Pour cela, nous pouvons lui fournir notre nom d'utilisateur et notre mot de passe.

Pour m'assurer du bon fonctionnement du projet, j'ai testé la route avec le bon, puis un mauvais mot de passe.

![Postman Auth sans erreur](https://md.roflcopter.fr/uploads/d7156c70-c2a5-4625-adae-eaa84599d3f1.png)
**Figure 6: Requête authentifié par Postman avec le bon mot de passe.**

![Postman Auth avec erreur](https://md.roflcopter.fr/uploads/64b9fe48-af3e-4009-9119-89a486e253b0.png)
**Figure 7: Requête authentifié par Postman avec le mauvais mot de passe.**

----

Pour créer la toute `/autre`, j'ai réutilisé le code de la route `/secu`.

```Js
fastify.after(() => {
    // Route /secu
    // ...

    fastify.route({
        method: 'GET',
        url: '/autre',
        handler: async (req, reply) => {
            return {
                replique: "C'est bien autre chose ça!"
            }
        }
    })
})
```

Je l'ai ensuite testé avec Postman.

![Route /autre sans Authentification](https://md.roflcopter.fr/uploads/efc8aa13-5701-4214-8b1b-9f05f75ae3ed.png)
**Figure 8: Test de la nouvelle route.**

## Étape 2 

Le projet communique pour l'instant en http, ce qui n'est pas sécurisé car les données sont envoyé sans aucune protection. Un mauvais acteur peut donc récupérer notre pseudo, et mot de passe.

Je vais donc configurer le projet pour utiliser le protocole https, qui chiffre nos données.

Pour cela, j'ai d'abord généré une clef privée RSA.

![](https://md.roflcopter.fr/uploads/92a43ed9-0a73-40d0-a3bb-2f17a7e5376b.png)
**Figure 9: Generation de la clef privée.**

Cette clef m'a ensuite permis de générer un CSR, ce fichier permet générer des certificats qui permettent aux serveurs de s'identifier.

![](https://md.roflcopter.fr/uploads/8051795e-8bf4-4c56-84d9-a44833c59c8d.png)
**Figure 10: Generation du Certificate Signing Request (CSR).**

Avec ce CRS, j'ai généré un certificat. C'est ce fichier qui permet au navigateur/client de vérifier qu'il communique bien avec le bon serveur.

![](https://md.roflcopter.fr/uploads/6f7da338-1f6a-4f18-b996-ed5aef14c839.png)
**Figure 11: Generation du certificat.**

----

Après cela, j'ai utilisé un serveur local de test d'openssl pour vérifier mon certificat et la connction https.

Postman renvoie initielement une erreur, car il refuse les certificats autosigné (comme celui qu' l'on a généré).

![Requette ssl self_signed_certificate Postman](https://md.roflcopter.fr/uploads/e09ffd2c-8451-4360-abff-5e13ae74ed2e.png)
**Figure 12: Test de la connection encrypté.**

J'ai donc modifié ce comportement dans les paramètres de Postman.

![SSl verif disabled](https://md.roflcopter.fr/uploads/2eb2ceb2-81bb-43bc-80e8-48bfb16839ad.png)
**Figure 13: Test de la connection encrypté.**

----

J'ai ensuite utilisé la documentation pour modifier l'instanciation de Fastify afin de lui permettre d'utiliser l'https.

```Js
const port = 443; // Port standard pour le https

const fastify = Fastify({
    logger: true,
    http2: true,
    https: {
        allowHTTP1: true, // Postman utilise http1
        key: readFileSync(path.join(__dirname, '..', 'https', 'server.key')),
        cert: readFileSync(path.join(__dirname, '..', 'https', 'server.cert'))
      }
    //, passphrase: "If there is a passphrase"
})
```

J'ai testé le la requête https sur /secu sur `https://localhost/secu` au lieu de `http://localhost/secu`.

![](https://md.roflcopter.fr/uploads/69ec0600-97a2-4c14-ac22-3725e1a6ced3.png)
**Figure 14: Test de la connection https.**

----

Remarque: Le code actuel lit les fichiers d'authentificaiton de manière synchrone. Les fichiers étant de très petite taille, cela n'augmente pas visiblement le temps d'exécution. Il est cependant possible de lire les fichiers en parallèle.

```Js

// Permet de lire les deux fichier en parallèle

[server_key, server_cert] = Promise.all(
    readFileSync(path.join(__dirname, '..', 'https', 'server.key')),
    readFileSync(path.join(__dirname, '..', 'https', 'server.cert'))
)

```
