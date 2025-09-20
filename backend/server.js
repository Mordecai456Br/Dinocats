const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const routes_dinocats = require('./routes/dinocatsRoutes');
const routes_users = require('./routes/usersRoutes');
const routes_invites = require('./routes/invitesRoutes');
const routes_battles = require('./routes/battlesRoutes');
const Utils = require('./utils');

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes_dinocats, routes_users, routes_invites, routes_battles);

app.get('/api', (req, res) => res.json({ message: 'Olá do servidor Node.js!' }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let idCounter = 1;
const battleRooms = {}; // estrutura: { [battleId]: { players: { [userId]: {ready, dinocat} }, bothReadyTriggered } }

// Conexões
const connections = { online: [], loggedOut: [] };
function logStatus() {
    Utils.logWithTime(`Online: ${connections.online.length} | Desconectados: ${connections.loggedOut.length}`);
}

// Conexão Socket
io.on('connection', (socket) => {
    const now = new Date().toLocaleString('pt-BR');
    const connObj = { socket: socket.id, id: idCounter++, connectedAt: now, disconnectedAt: null };
    connections.online.push(connObj);

    Utils.logWithTime(`✅ Conectado: ${socket.id} | id interno: ${connObj.id}`);
    logStatus();

    // Ping
    socket.on('ping', () => socket.emit('pong', { message: 'Pong do servidor!' }));

    // Usuário logado
    socket.on('loggedUser', (userId, callback) => {
        Utils.logWithTime(`Usuário logado: ${userId} (socket ${socket.id})`);
        if (callback) callback({ message: 'Usuário registrado com sucesso!' });
    });

    // Entrar na sala de batalha
    socket.on('joinBattleRoom', ({ battleId, userId }) => {
        socket.userId = userId;
        socket.join(battleId);

        if (!battleRooms[battleId]) battleRooms[battleId] = { players: {}, bothReadyTriggered: false };

        // Reseta ready ao entrar
        battleRooms[battleId].players[userId] = { ready: false, dinocat: null };

        const roomSize = io.sockets.adapter.rooms.get(battleId)?.size || 0;
        console.log(`User: ${userId}, socket: ${socket.id} | Sala ${battleId}, usuários: ${roomSize}`);

        if (roomSize === 2) io.to(battleId).emit('bothInRoom', { battleId });
        io.to(battleId).emit('userJoined', { userId, socket: socket.id, battleId });
    });

    // Dinocat selecionado
    socket.on('dinocatSelected', ({ roomId, dinocat }) => {
        console.log(`Dinocat selecionado na sala ${roomId}:`, dinocat);
        socket.to(roomId).emit('opponentSelected', { dinocat });
    });

    // Jogador pronto
    socket.on('playerReady', ({ battleId, userId, dinocat }) => {
        const room = battleRooms[battleId];
        if (!room) return;

        room.players[userId] = { ready: true, dinocat };
        socket.to(battleId).emit('opponentReady', { userId, dinocat });

        const players = Object.values(room.players);
        if (!room.bothReadyTriggered && players.length === 2 && players.every(p => p.ready)) {
            room.bothReadyTriggered = true;
            console.log(`Ambos os jogadores na sala ${battleId} estão prontos!`);
            io.to(battleId).emit('bothReady');
        }
    });

    // Mensagens
    socket.on('sendMessage', ({ roomId, message, userId }) => {
        io.to(roomId).emit('message', { userId, message, socket: socket.id });
    });

    // Desconexão
    socket.on('disconnect', () => {
        const now = new Date().toLocaleString('pt-BR');
        const idx = connections.online.findIndex(c => c.socket === socket.id);
        if (idx !== -1) {
            const [c] = connections.online.splice(idx, 1);
            c.disconnectedAt = now;
            connections.loggedOut.push(c);
        }

        for (const battleId in battleRooms) {
            if (battleRooms[battleId].players[socket.userId]) {
                delete battleRooms[battleId].players[socket.userId];
                console.log(`Jogador ${socket.userId} removido da sala ${battleId} ao desconectar.`);
            }
        }

        Utils.logWithTime(`❌ Desconectado: ${socket.id}`);
        logStatus();
    });
});

server.listen(5000, () => Utils.logWithTime('Servidor rodando na porta 5000'));
