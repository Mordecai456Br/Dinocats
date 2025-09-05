const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes/dinocatsRoutes');

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
    res.json({ message: 'Olá do servidor Node.js!'})
})

app.listen(5000, () => console.log('Servidor rodando na porta 5000'))