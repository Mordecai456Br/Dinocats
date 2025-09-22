const express = require('express');
const router = express.Router();

// Controllers
const DinocatsController = require('../controllers/dinocats/dinocatsController.js');
const SkillsController = require('../controllers/dinocats/skillsController.js');
const EmotionsController = require('../controllers/dinocats/emotionsController.js');




/////////////////////////
// DINOCATS
/////////////////////////
router.get('/dinocats', DinocatsController.getAll);
router.get('/dinocats/:id', DinocatsController.getById);
router.post('/dinocats', DinocatsController.create);
router.put('/dinocats/:id', DinocatsController.update);
router.delete('/dinocats/:id', DinocatsController.remove);

/////////////////////////
// ASSOCIAÇÕES
/////////////////////////

// Associar/remover skill a Dinocat
router.post('/dinocats/skills', SkillsController.insertIntoDinocat);
router.delete('/dinocats/skills', SkillsController.removeFromDinocat);

// Associar/remover emoção a Dinocat
router.post('/dinocats/emotions', EmotionsController.insertIntoDinocat);
router.delete('/dinocats/emotions', EmotionsController.removeFromDinocat);


module.exports = router;
