const express = require('express');
const cors = require('cors');
const app = express();

const http = require('http');
const { Server } = require('socket.io');

const routes_dinocats = require('./routes/dinocatsRoutes');
const routes_users = require('./routes/usersRoutes');
const routes_invites = require('./routes/invitesRoutes');
const routes_battles = require('./routes/battlesRoutes');
const Utils = require('./utils');

app.use(cors());
app.use(express.json());
app.use(routes_dinocats, routes_users, routes_invites, routes_battles);

app.get('/api', (req, res) => {
  res.json({ message: 'Olá do servidor Node.js!' });
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let connectionsRegistered = [];
let connectionsOnline = [];
let connectionsLoggedOut = [];
let idCounter = 1;

const battleRooms = {};

function showConnectionStatus() {
  Utils.logWithTime(`Online: ${connectionsOnline.length} | Disconnected: ${connectionsLoggedOut.length}`);
}

io.on('connection', (socket) => {
  const now = new Date().toLocaleString('pt-BR');
  const connectionObj = { socket: socket.id, id: idCounter++, connectedAt: now, disconnectedAt: null };

  connectionsOnline.push(connectionObj);
  connectionsRegistered.push(connectionObj);

  Utils.logWithTime(`✅➡️ CONECTADO:`, connectionObj.socket, connectionObj.id, `in: ${connectionObj.connectedAt} out: ${connectionObj.disconnectedAt}`);
  showConnectionStatus();


  socket.on('ping', () => {
    const index = connectionsRegistered.findIndex(conn => conn.socket === socket.id);
    Utils.logWithTime('Ping recebido de', socket.id, connectionsRegistered[index].id);
    socket.emit('pong', { message: 'Pong do servidor!' });
  });


  socket.on('loggedUser', (userId, callback) => {
    Utils.logWithTime(`Usuário logado: ${userId} (socket ${socket.id})`);
    if (callback) callback({ message: 'Usuário registrado com sucesso!' });
  });


  socket.on('disconnect', () => {
    const now = new Date().toLocaleString('pt-BR');
    const index = connectionsOnline.findIndex(conn => conn.socket === socket.id);

    if (index !== -1) {
      const [connectionOut] = connectionsOnline.splice(index, 1);
      connectionOut.disconnectedAt = now;
      connectionsLoggedOut.push(connectionOut);
    }

    Utils.logWithTime('❌⬅️ DESCONECTADO:', connectionObj.socket, connectionObj.id, `in: ${connectionObj.connectedAt} out: ${connectionObj.disconnectedAt}`);
    showConnectionStatus();
  });

  // Entrar na sala de batalha

  socket.on('joinBattleRoom', ({ battleId, userId }) => {
    socket.join(battleId)
    console.log(`User: ${userId}, socket: ${socket.id} | joined room ${battleId}`)

    const room = io.sockets.adapter.rooms.get(battleId);
    const usersInRoom = room ? room.size : 0;
    console.log(`Usuários na sala ${battleId}: ${usersInRoom}`);

    if(usersInRoom === 2){
      io.to(battleId).emit('bothInRoom', { battleId })
    }
    io.to(battleId).emit('userJoined', { userId, socket: socket.id, battleId })
  });

  socket.on('sendMessage', ({ roomId, message, userId }) => {
    io.to(roomId).emit('message', { userId, message: message, socket: socket.id })
  })
});

server.listen(5000, () => Utils.logWithTime('Servidor rodando na porta 5000'));
