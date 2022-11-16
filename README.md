# Servidor con balance de carga - Coderhouse

# Comandos

```sh
pm2 start server.js --name='forkServer' --watch -- -p 8080
pm2 start server.js --name='clusterServer' -i max --watch -- -p 8081
```

o

```sh
node server.js
node server.js -p 8081 -m cluster
```