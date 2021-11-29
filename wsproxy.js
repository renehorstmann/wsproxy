let ws = require('ws');
let net = require('net');


const proxy_address = '127.0.0.1'
const proxy_port = 10000;
const ws_port = 10001;

let ws_server = new ws.WebSocketServer({port: ws_port});
console.log('wsproxy listening on ws://localhost:' + ws_port + '/');

let cnt = 0;
ws_server.on('connection', ws_client => {
    cnt += 1;
    console.log('Client connected [' + cnt + ']');

    let proxy = net.createConnection(proxy_port, proxy_address);
    proxy.on('connect', () => {
        console.log('Connected to proxy');

        // websocket ws_client message callback
        ws_client.on('message', message => {
            console.log('ws_client send: ' + message)
            proxy.write(message)
        });

        ws_client.on('close', close => {
            console.log('ws_client closed');
            proxy.end()
        });

        // proxy message callback
        proxy.on('data', data => {
            console.log('proxy send: ' + data)
            ws_client.send(data)
        });

        proxy.on('close', had_error => {
            console.log('proxy closed');
            ws_client.close();
        });

    }); // proxy.on

});     // ws_server.on
