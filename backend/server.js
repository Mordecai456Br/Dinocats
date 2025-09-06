const express = require('express');
const cors = require('cors');
const app = express();

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
    res.json({ message: 'Olá do servidor Node.js!'})
})

app.listen(5000, () => console.log('Servidor rodando na porta 5000'))