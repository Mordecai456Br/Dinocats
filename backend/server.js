const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

// Importe suas rotas e modelos como antes
const routes_dinocats = require('./routes/dinocatsRoutes');
const routes_users = require('./routes/usersRoutes');
const routes_invites = require('./routes/invitesRoutes');
const routes_battles = require('./routes/battlesRoutes');
const BattlesModel = require('./models/battles/battlesModel');
const Utils = require('./utils');

const app = express();
app.use(require('cors')());
app.use(express.json());
app.use(routes_dinocats, routes_users, routes_invites, routes_battles);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// --- LÓGICA DO SERVIDOR DE JOGO ---
// Gerencia quais usuários estão online
const onlineUsers = new Set();

// Um objeto para gerenciar o estado de todas as salas de batalha ativas
const battleRooms = {};

/* Estrutura de uma sala:
battleRooms[battleId] = {
  players: {
    [userId1]: { socketId, dinocat: null, isReady: false },
    [userId2]: { socketId, dinocat: null, isReady: false }
  },
  playerOrder: [userId1, userId2], // Para saber quem é o player 1 e 2
  battleStarted: false
};
*/

io.on('connection', (socket) => {
    Utils.logWithTime(`✅ Usuário conectado: ${socket.id}`);

    socket.on('playerOnline', ({ userId }) => {
        onlineUsers.add(userId);
        Utils.logWithTime(`Player ${userId} está online.`);
    });
    // Jogador entra em uma sala de batalha
    socket.on('joinBattleRoom', ({ battleId, user }) => {
        if (!user) return;
        socket.join(battleId);
        socket.userId = user.id; // Associar userId ao socket
        socket.battleId = battleId; // Associar battleId ao socket

        // Inicializa a sala se for o primeiro jogador
        if (!battleRooms[battleId]) {
            battleRooms[battleId] = {
                players: {},
                playerOrder: [],
                battleStarted: false,
            };
        }

        // Adiciona o jogador à sala (se não estiver lá)
        const room = battleRooms[battleId];
        if (!room.players[user.id]) {
            room.players[user.id] = {
                socketId: socket.id,
                dinocat: null,
                isReady: false,
            };
            room.playerOrder.push(user.id);
            Utils.logWithTime(`Player ${user.id} entrou na sala ${battleId}.`);
        } else {
            // Atualiza o socketId caso o usuário tenha reconectado
            room.players[user.id].socketId = socket.id;
            Utils.logWithTime(`Player ${user.id} reconectou à sala ${battleId}.`);
        }

        // Envia o estado atualizado da sala para todos os clientes nela
        io.to(battleId).emit('battleStateUpdate', room);

        if (Object.keys(room.players).length === 2) {
            io.to(battleId).emit('bothInRoom');
            Utils.logWithTime(`Sala ${battleId} tem ambos os jogadores!`);
        }
    });

    // Jogador seleciona um Dinocat
    socket.on('selectDinocat', ({ battleId, userId, dinocat }) => {
        const room = battleRooms[battleId];
        if (room && room.players[userId]) {
            room.players[userId].dinocat = dinocat;
            Utils.logWithTime(`Player ${userId} na sala ${battleId} selecionou ${dinocat.name}.`);

            // Envia a atualização para todos na sala
            io.to(battleId).emit('battleStateUpdate', room);
        }
    });

    // Jogador clica em "Pronto"
    socket.on('playerReady', async ({ battleId, userId }) => {
        const room = battleRooms[battleId];
        if (room && room.players[userId] && room.players[userId].dinocat) {
            room.players[userId].isReady = true;
            Utils.logWithTime(`Player ${userId} na sala ${battleId} está pronto.`);

            // Verifica se todos estão prontos
            const players = Object.values(room.players);
            if (players.length === 2 && players.every(p => p.isReady)) {
                if (!room.battleStarted) {
                    room.battleStarted = true; // Impede duplo início
                    Utils.logWithTime(`Batalha ${battleId} começando!`);

                    // Atualiza o banco de dados
                    try {
                        const [p1_id, p2_id] = room.playerOrder;
                        await BattlesModel.update(battleId, {
                            dinocat1_id: room.players[p1_id].dinocat.id,
                            dinocat2_id: room.players[p2_id].dinocat.id,
                            status: 'ongoing',
                            started_at: new Date().toISOString()
                        });
                        Utils.logWithTime(`Banco de dados para batalha ${battleId} atualizado.`);
                    } catch (error) {
                        console.error(`Erro ao atualizar o banco para batalha ${battleId}:`, error);
                    }

                    // Envia comando para iniciar a batalha para os clientes
                    io.to(battleId).emit('battleStart', room);
                }
            } else {
                // Se ainda não estão todos prontos, apenas atualiza o estado
                io.to(battleId).emit('battleStateUpdate', room);
            }
        }
    });

    // Lida com desconexão
    socket.on('disconnect', () => {
        Utils.logWithTime(`❌ Usuário desconectado: ${socket.id}`);
        const { userId, battleId } = socket;
        if (socket.userId) {
            onlineUsers.delete(socket.userId);
            Utils.logWithTime(`Player ${socket.userId} saiu (desconectou).`);
        }

        if (userId && battleId && battleRooms[battleId]) {
            const room = battleRooms[battleId];
            if (room.players[userId]) {
                // Informa ao outro jogador que o oponente saiu
                socket.to(battleId).emit('opponentDisconnected', { userId });

                // Limpa o jogador da sala
                delete room.players[userId];
                room.playerOrder = room.playerOrder.filter(id => id !== userId);
                Utils.logWithTime(`Player ${userId} removido da sala ${battleId} por desconexão.`);

                // Se a sala ficar vazia, remove-a
                if (Object.keys(room.players).length === 0) {
                    delete battleRooms[battleId];
                    Utils.logWithTime(`Sala ${battleId} vazia e removida.`);
                }
            }
        }
    });
});

server.listen(5000, () => Utils.logWithTime('Servidor rodando na porta 5000'));
