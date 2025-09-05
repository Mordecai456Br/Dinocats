const UsersModel = require('../models/usersModel');

module.exports = {
    async getAll(req, res) {
        try {
            const users = await UsersModel.findAll();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const user = await UsersModel.findById(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const user = await UsersModel.create(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const user = await UsersModel.update(req.params.id, req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const user = await UsersModel.remove(req.params.id);
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
