const express = require('express');
const router = express.Router();

const BattlesController = require('../controllers/battles/battlesController')


router.get('/battles', BattlesController.getAll);
router.get('/battles/:id', BattlesController.getById);
router.post('/battles', BattlesController.create);
router.put('/battles/:id/winner', BattlesController.updateWinner); // rota especial para definir vencedor
router.delete('/battles/:id', BattlesController.remove);

module.exports = router;