const corsAnywhere = require('cors-anywhere');
const express = require('express');

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;

const proxyServer = corsAnywhere.createServer({
    originWhitelist: [],
    requireHeader: [],
    removeHeaders: ['cookie', 'cookie2']
});

const app = express();

app.get('/', (req, res) => {
    res.send('CORS Anywhere Proxy is Running! Use it by appending your URL to this server address.');
});

app.all('/*', (req, res) => {
    proxyServer.emit('request', req, res);
});

app.listen(port, host, () => {
    console.log(`Running CORS Anywhere on http://${host}:${port}`);
});
