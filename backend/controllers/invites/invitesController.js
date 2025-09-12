const invitesModel = require('../../models/invites/invitesModel');
const InvitesModel = require('../../models/invites/invitesModel');
const usersModel = require('../../models/users/usersModel');


module.exports = {
    async getAll(req, res) {
        try {
            const invites = await InvitesModel.getAll();
            res.json(invites);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const invite = await InvitesModel.getById(req.params.id);
            if (!invite) return res.status(404).json({ message: 'Invite not found' });
            res.json(invite);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getUserInvites(req, res) {
        try {
            const userId = req.params.id
            if (!userId) return res.status(404).json({ message: 'user not found' })

            const userInvites = await InvitesModel.getUserInvites(userId);
            res.json(userInvites);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getOpenInvites(req, res) {
        try {
            const userId = req.params.id
            if (!userId) return res.status(404).json({ message: 'user not found' })

            const openInvites = await InvitesModel.getOpenInvites(userId);
            res.json(openInvites);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const { user1_id, user2_id } = req.body
            if (Number(user1_id) === Number(user2_id)) return res.status(400).json({ error: 'you cant invite yourself' })

            const invite = await InvitesModel.create({ user1_id, user2_id });
            res.status(201).json(invite);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const invite = await InvitesModel.update(req.params.id, req.body);
            res.json(invite);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async acceptInvite(req, res) {
        try {
            const inviteId = req.params.id

            const invite = await invitesModel.getById(inviteId);

            if (!invite) return res.status(404).json({ message: 'invite not found' })
            if (invite.accepted) return res.status(409).json({ message: 'this invite has been accepted before'})



            const user1 = await usersModel.getById(invite.user1_id)
            if (user1.is_on_battle_mode) return res.status(403).json({ message: `${user1.name} (${user1.id}) is on battle mode` })
            const user2 = await usersModel.getById(invite.user2_id)
            if (user2.is_on_battle_mode) return res.status(403).json({ message: `${user2.name} (${user2.id}) is on battle mode` })

            

            const updatedInvite = await invitesModel.acceptInvite(inviteId)
            await usersModel.setBattleMode(user1.id, user2.id, true);
            return res.json({ message: `${user1.name} (${user1.id}) and ${user2.name} (${user2.id}) has been set on battle mode`, updatedInvite})

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async declineInvite(req, res) {
        try {
            const inviteId = req.params.id

            const invite = await invitesModel.getById(inviteId);

            if (!invite) return res.status(404).json({ message: 'invite not found' })
            if (invite.accepted) return res.status(409).json({ message: 'this invite has been accepted before'})


            const user1 = await usersModel.getById(invite.user1_id)
            const user2 = await usersModel.getById(invite.user2_id)

            const updatedInvite = await invitesModel.declineInvite(inviteId)
            await usersModel.setBattleMode(user1.id, user2.id, false);
            return res.json({ message: `${user1.name} (${user1.id}) and ${user2.name} (${user2.id}) has been out of battle mode`, updatedInvite})

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const invite = await InvitesModel.remove(req.params.id);
            res.json(invite);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
