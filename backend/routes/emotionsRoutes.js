const express = require('express');
const router = express.Router();

const EmotionsController = require('../controllers/emotions/emotionsController');

/////////////////////////
// EMOTIONS
/////////////////////////
router.get('/emotions', EmotionsController.getAll);
router.get('/emotions/:id', EmotionsController.getById);
router.post('/emotions', EmotionsController.create);
router.put('/emotions/:id', EmotionsController.update);
router.delete('/emotions/:id', EmotionsController.remove);

module.exports = router;