const express = require('express')
const router = express.Router()

const InvitesController = require('../controllers/invites/invitesController')

router.get('/invites', InvitesController.getAll);
router.get('/invites/:id', InvitesController.getById);

router.post('/invites', InvitesController.create);
router.post('/invites/:id/accept', InvitesController.acceptInvite);

router.put('/invites/:id', InvitesController.update);
router.delete('/invites/:id', InvitesController.remove);

module.exports = router;