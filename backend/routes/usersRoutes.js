const express = require('express');
const router = express.Router();


const UsersController = require('../controllers/users/usersController.js');
const InvitesController = require('../controllers/invites/invitesController.js');



router.get('/users', UsersController.getAll);
router.get('/users/:id', UsersController.getById);
router.get('/users/:id/dinocats', UsersController.getDinocatsByUserId);
router.get('/users/:id/open_invites', InvitesController.getOpenInvites);
router.get('/users/:id/invites', InvitesController.getUserInvites);

router.post('/users', UsersController.create);

router.put('/users/:id', UsersController.update);

router.delete('/users/:id', UsersController.remove);

module.exports = router;