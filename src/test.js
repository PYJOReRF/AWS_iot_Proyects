const express = require("express");
const http = require("http");
const { Server: WebSocketServer } = require("socket.io");

const app = express();
const httpServer = http.createServer(app);
const io = new WebSocketServer(httpServer, {
  transports: ['websocket'],
});

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log(`Nueva conexión: ${socket.id}`);

    // Manejar eventos de mensajes desde el cliente
    socket.on('mensaje', (mensaje) => {
        console.log(`Mensaje recibido del cliente: ${mensaje}`);

        // Responder al cliente
        socket.emit('Responder', 'RECIBIDO');
    });
});

httpServer.listen(PORT, () => {
    console.log(`Servidor iniciado en ws://172.16.22.229:${PORT}`);
});