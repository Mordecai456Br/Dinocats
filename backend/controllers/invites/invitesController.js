const InvitesModel = require('../../models/invites/invitesModel');

module.exports = {
    async getAll(req, res) {
        try {
            const invites = await InvitesModel.findAll();
            res.json(invites);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const invite = await InvitesModel.findById(req.params.id);
            if (!invite) return res.status(404).json({ message: 'Invite not found' });
            res.json(invite);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getUserInvites(req, res){
        try {
            const userId = req.params.id
            if (!userId) return res.status(404).json({ message: 'user not found'})

            const userInvites = await InvitesModel.getUserInvites(userId);
            res.json(userInvites);

        } catch (err){
            res.status(500).json({ error: err.message });
        }
    },
    
    async getOpenInvites(req, res){
        try {
            const userId = req.params.id
            if (!userId) return res.status(404).json({ message: 'user not found'})

            const openInvites = await InvitesModel.getOpenInvites(userId);
            res.json(openInvites);

        } catch (err){
            res.status(500).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const { user1_id, user2_id, dinocat1_id, dinocat2_id } = req.body
            if (user1_id === user2_id) return res.status(400).json({ error: 'you cant invite yourself'})

            const invite = await InvitesModel.create({ user1_id, user2_id, dinocat1_id, dinocat2_id });
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

    async remove(req, res) {
        try {
            const invite = await InvitesModel.remove(req.params.id);
            res.json(invite);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
