# Loggers y GZIP, Análisis completo de performance

## Comandos

### Artillery and profiling
```sh
node --prof server.js
artillery run -o prof.json artillery.yml
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
artillery report prof.json
```

### Node inspect
```sh
node --inspect server.js
artillery run -o inspect.json artillery.yml
artillery report inspect.json
```

### Autocannon CLI
```sh
autocannon http://localhost:8080/info -c 100 -d 20
```