const express = require('express');
const router = express.Router();

// Controllers
const UsersController = require('../controllers/usersController.js');
const DinocatsController = require('../controllers/dinocatsController.js');
const SkillsController = require('../controllers/skillsController.js');
const EmotionsController = require('../controllers/emotionsController.js');

/////////////////////////
// USERS
/////////////////////////
router.get('/users', UsersController.getAll);
router.get('/users/:id', UsersController.getById);
router.post('/users', UsersController.create);
router.put('/users/:id', UsersController.update);
router.delete('/users/:id', UsersController.remove);

/////////////////////////
// DINOCATS
/////////////////////////
router.get('/dinocats', DinocatsController.getAll);
router.get('/dinocats/:id', DinocatsController.getById);
router.post('/dinocats', DinocatsController.create);
router.put('/dinocats/:id', DinocatsController.update);
router.delete('/dinocats/:id', DinocatsController.remove);

/////////////////////////
// SKILLS
/////////////////////////
router.get('/skills', SkillsController.getAll);
router.get('/skills/:id', SkillsController.getById);
router.post('/skills', SkillsController.create);
router.put('/skills/:id', SkillsController.update);
router.delete('/skills/:id', SkillsController.remove);

// Associar/remover skill a Dinocat
router.post('/dinocats/skills', SkillsController.insertIntoDinocat);
router.delete('/dinocats/skills', SkillsController.removeFromDinocat);

/////////////////////////
// EMOTIONS
/////////////////////////
router.get('/emotions', EmotionsController.getAll);
router.get('/emotions/:id', EmotionsController.getById);
router.post('/emotions', EmotionsController.create);
router.put('/emotions/:id', EmotionsController.update);
router.delete('/emotions/:id', EmotionsController.remove);

// Associar/remover emoção a Dinocat
router.post('/dinocats/emotions', EmotionsController.insertIntoDinocat);
router.delete('/dinocats/emotions', EmotionsController.removeFromDinocat);

module.exports = router;
