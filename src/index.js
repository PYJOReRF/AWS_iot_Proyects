import express from "express"
import { Server as WebSocketServer } from "socket.io"
import http from 'http'

const server = express()
const httpServer = http.createServer(server)
const io = new WebSocketServer(httpServer)

server.use(express.static(__dirname + '/publico'))

io.on('connection', (socket) => {
    console.log('nueva conexion:', socket.id)
})

httpServer.listen(3000)
console.log("server iniciado en el PUERTO :..3000")