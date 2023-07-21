const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const cors = require('cors')

const app = express()
const port = process.env.PORT | 3000
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: ["http://localhost:3001", "https://battleship1.netlify.app"],
    methods: ["GET", "POST"]
  }
})

// app.use(express.static('public'))
app.use(cors())

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
//socket work
let connections = [null, null]
let playerIndex = 0
io.on('connection', socket => {
  const roomId = socket.handshake.query.room
  if((io.sockets.adapter.rooms.get(roomId) && io.sockets.adapter.rooms.get(roomId).size === 2))
  {
    socket.emit('player-number', -1)
    // socket.leave(roomId)
    return
  }
  socket.join(roomId)
  
  // for(const i in connections){
  //   if(connections[i] === null){
  //     playerIndex = i
  //     break
  //   }
  // }
  socket.emit('player-number', playerIndex)
  playerIndex++
  console.log(`Player ${playerIndex} has connected`)
  //ignoring player 3
  if(playerIndex === -1)  return

  connections[playerIndex] = false
  if(io.sockets.adapter.rooms.get(roomId).size === 2) socket.to(roomId).emit('enemy-connected')
  
  socket.to(roomId).emit('player-connection', playerIndex)
  socket.on('disconnect', () => {
    console.log(`Player ${playerIndex} disconnected`)
    connections[playerIndex] = null
    socket.to(roomId).emit('player-connection', playerIndex)
  })

  socket.on('enemy-connected', () => {
    socket.to(roomId).emit('enemy-connected')
  })

  socket.on('player-ready', () => {
    socket.to(roomId).emit('enemy-ready')
    // connections[playerIndex] = true
  })

  // socket.on('check-players', () => {
  //   const players = []
  //   for(const i in connections)
  //     connections[i] === null ? players.push({connected: false, ready: false}) : players.push({connected: true, ready: connections[i]})
  //   socket.emit('check-players', players)
  // })

  socket.on('fire', id => {
    console.log(`Shot fired from ${playerIndex}`, id)
    socket.to(roomId).emit('fire', id)
  })

  socket.on('fire-reply', square =>{
    console.log('fire-reply', square)
    socket.to(roomId).emit('fire-reply', square)
  })

  setTimeout(() => {
    connections[playerIndex] = null
    socket.emit('timeout')
    socket.disconnect()
  }, 600000)
})
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

