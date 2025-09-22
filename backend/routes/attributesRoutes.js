const express = require('express');
const router = express.Router();


const AttributesController = require('../controllers/attributes/attributesController');

/////////////////////////
// ATTRIBUTES
/////////////////////////
router.get('/attributes', AttributesController.getAll);
router.get('/attributes/:id', AttributesController.getById);
router.post('/attributes', AttributesController.create);
router.put('/attributes/:id', AttributesController.update);
router.delete('/attributes/:id', AttributesController.remove);

module.exports = router;