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

    async create(req, res) {
        try {
            const invite = await InvitesModel.create(req.body);
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
