# Rapport 

## Build l'image et lancer le container 

```Sh
docker build . -t img
docker run -p 8080:3000 img
```

```Sh
docker ps -a

docker stop container_id
docker rm container_id
```
