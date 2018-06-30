import express from 'express';
import http from 'http';
import socket from 'socket.io';

import clientEvents from './clientEvents';
const app = express();
const server = http.createServer(app);
const io = socket(server);

io.on('connection', (client) => {
  // console.log(client)

  Object.keys(clientEvents).forEach((event) => {
    client.on(event, clientEvents[event].bind(null, { io, client }));
  })
})

const port = process.env.PORT || 3777;
server.listen(port, () => console.log('socket is listening on port: ', port));