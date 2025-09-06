const DinocatsModel = require('../../models/dinocats/dinocatsModel');

module.exports = {
    async getAll(req, res) {
        try {
            const dinos = await DinocatsModel.findAll();
            res.json(dinos);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const dino = await DinocatsModel.findById(req.params.id);
            if (!dino) return res.status(404).json({ message: 'Dinocat not found' });
            res.json(dino);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const dino = await DinocatsModel.create(req.body);
            res.status(201).json(dino);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const dino = await DinocatsModel.update(req.params.id, req.body);
            res.json(dino);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const dino = await DinocatsModel.remove(req.params.id);
            res.json(dino);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
