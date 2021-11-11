let ws = require('ws');
let net = require('net');


const proxy_port = 10000;
const ws_port = 10001;

let ws_server = new ws.WebSocketServer({port: ws_port});
console.log('wsproxy listening on ws://localhost:' + ws_port + '/');

let cnt = 0;
ws_server.on('connection', function (ws_client) {
    cnt += 1;
    console.log('Client connected [' + cnt + ']');


    let proxy = net.createConnection(proxy_port);
    proxy.on('connect', function () {
        console.log('Connected to proxy');

        // websocket ws_client message callback
        ws_client.on('message', function (message) {
            console.log('ws_client send: ' + message)
            proxy.write(message)
        });

        ws_client.on('close', function (close) {
            console.log('ws_client closed');
            proxy.end()
        });

        // proxy message callback
        proxy.on('data', function (data) {
            console.log('proxy send: ' + data)
            ws_client.send(data)
        });

        proxy.on('close', function (had_error) {
            console.log('proxy closed');
            ws_client.close();
        });

    }); // proxy.on

});     // ws_server.on
