const express = require('express');
const router = express.Router();


const UsersController = require('../controllers/users/usersController.js');



router.get('/users', UsersController.getAll);
router.get('/users/:id', UsersController.getById);
router.post('/users', UsersController.create);
router.put('/users/:id', UsersController.update);
router.delete('/users/:id', UsersController.remove);

module.exports = router;