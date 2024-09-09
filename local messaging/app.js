const readline = require('readline');
var express = require('express')
var app = express()
var serv = require('http').Server(app)
const { v4: uuidv4 } = require('uuid');
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html')
})
app.use('/client', express.static(__dirname + '/client'))

serv.listen(2000)
console.log("[Server] Server listening on port 2000")
var io = require('socket.io')(serv, {})

io.sockets.on('connection', function (socket) {
    socket.id = uuidv4()
    socket.name = ""
    socket.on('name', (data) => {
        socket.name = data
    })
    console.log(`${socket.name} (${socket.id}) connected`)
    io.emit('sendMessage', {
        sender: "[Server]",
        message: `${socket.id} connected`
    })
    socket.emit('sendID', socket.id)
    socket.on('message', (data) => {
        console.log(data)
        io.emit('sendMessage', {
            sender: socket.name,
            message: data
        })
    })
    socket.on('disconnect', () => {
        console.log(`${socket.name} (${socket.id}) disconnected`)
        io.emit('sendMessage', {
            sender: "[Server]",
            message: `${socket.id} disconnected`
        })
    })
})