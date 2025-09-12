const express = require('express');
const cors = require('cors');
const app = express();

const http = require('http');
const { Server } = require('socket.io')

const routes_dinocats = require('./routes/dinocatsRoutes');
const routes_users = require('./routes/usersRoutes')
const routes_invites = require('./routes/invitesRoutes');
const routes_battles = require('./routes/battlesRoutes');

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


const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on("connection", (socket) => {
  console.log("conectado:", socket.id);

  socket.on('ping', () => {
    console.log('Ping recebido de', socket.id);
    // responde com "pong"
    socket.emit('pong', { message: 'Pong do servidor!' });
  });

  // evento de teste de registro de usuário
  socket.on('registerUser', (userId, callback) => {
    console.log(`Usuário registrado: ${userId} (socket ${socket.id})`);
    if(callback) callback({ message: 'Usuário registrado com sucesso!' });
  });

  // desconexão
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});



server.listen(5000, () => console.log('Servidor rodando na porta 5000'));
