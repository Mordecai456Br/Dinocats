const express = require('express');
const cors = require('cors');
const app = express();

const http = require('http');
const { Server } = require('socket.io')

const routes_dinocats = require('./routes/dinocatsRoutes');
const routes_users = require('./routes/usersRoutes')
const routes_invites = require('./routes/invitesRoutes');
const routes_battles = require('./routes/battlesRoutes');
const { disconnect } = require('process');
const Utils = require('./utils')
app.use(cors());
app.use(express.json());
app.use(
  routes_dinocats,
  routes_users,
  routes_invites,
  routes_battles,
)

app.get('/api', (req, res) => {
  res.json({ message: 'Olá do servidor Node.js!' })
})

const battleRooms = {};
let connectionsRegistered = [];
let connectionsLoggedOut = [];
let connectionsOnline = [];
let idCounter = 1

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});
function showConexioStatus() {
  Utils.logWithTime(`Online: ${connectionsOnline.length} | Disconnected: ${connectionsLoggedOut.length}`)
}
io.on("connection", (socket) => {
  const now = new Date().toLocaleString("pt-BR");
  const connectionObj = {
    socket: socket.id,
    id: idCounter++,
    connectedAt: now,
    disconnectedAt: null
  }
  connectionsOnline.push(connectionObj);
  connectionsRegistered.push(connectionObj);
  console.log(`✅➡️  CONECTADO: ${connectionObj.socket} ${connectionObj.id} | ${JSON.stringify(connectionObj.connectedAt, connectionObj.disconnectedAt)}`);
  showConexioStatus();

  socket.on('ping', () => {
    const index = connectionsRegistered.findIndex(connection => connection.socket === socket.id)
    console.log('Ping recebido de', socket.id, connectionsRegistered[index]);
    // responde com "pong"
    socket.emit('pong', { message: 'Pong do servidor!' });
  });

  // evento de teste de registro de usuário
  socket.on('registerUser', (userId, callback) => {
    console.log(`Usuário registrado: ${userId} (socket ${socket.id})`);
    if (callback) callback({ message: 'Usuário registrado com sucesso!' });
  });

  // desconexão
  socket.on('disconnect', () => {
    const now = new Date().toLocaleString("pt-BR");

    const index = connectionsOnline.findIndex(connection => connection.socket === socket.id)
    if (index !== -1) {
      const [connectionOut] = connectionsOnline.splice(index, 1)
      connectionOut.disconnectedAt = now;
      console.log(connectionOut)
      connectionsLoggedOut.push(connectionOut);
    }
    console.log('❌⬅️  DESCONECTADO:', socket.id, index + 1);
    console.log(`Online: ${connectionsOnline.length} | Disconnected: ${connectionsLoggedOut.length}`)
  });

  socket.on("joinBattleRoom", ({ inviteId, userId }) => {
    socket.join(inviteId);
    console.log(`User ${userId} entrou na sala ${inviteId}`);

    if (!battleRooms[inviteId]) battleRooms[inviteId] = [];
    if (!battleRooms[inviteId].includes(userId)) battleRooms[inviteId].push(userId);

    // se todos estiverem presentes (2 jogadores), avisa ambos
    if (battleRooms[inviteId].length === 2) {
      io.to(inviteId).emit("bothInRoom", { inviteId });
      console.log(`Todos na sala ${inviteId}, emitindo bothInRoom`);
    }
  });

});



server.listen(5000, () => console.log('Servidor rodando na porta 5000'));
