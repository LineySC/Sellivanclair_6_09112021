const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Le serveur est démarré ! ');
});

server.listen(process.env.PORT || 3000);