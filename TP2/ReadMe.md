# Rapport 

## Docker cheatsheet 

### Lancement de l'application 

```Sh
# Pour créer un image `img`
docker build . -t img

# Pour lancer un container basé sur l'image
docker run -p 8080:3000 img
```

### Gestion des containers 

```Sh
# Pour afficher tout les containers de la machine 
docker ps -a

# Pour arrêter un container 
docker stop container_id

# Pour supprimer un container de la machine 
docker rm container_id
```

## Compte rendu

### Travail effectué

J'ai effectué toutes les étapes de ce TP. J'ai donc créé une application nodejs
avec fastify, 


### Ce que j'ai appris

### Mes choix

