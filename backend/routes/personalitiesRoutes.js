const express = require('express');
const router = express.Router();

// Controller
const PersonalitiesController = require('../controllers/personalities/personalitiesController.js');

/////////////////////////
// PERSONALITIES
/////////////////////////
router.get('/personalities', PersonalitiesController.getAll);
router.get('/personalities/:id', PersonalitiesController.getById);
router.post('/personalities', PersonalitiesController.create);
router.put('/personalities/:id', PersonalitiesController.update);
router.delete('/personalities/:id', PersonalitiesController.remove);

module.exports = router;
