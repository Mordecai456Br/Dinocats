const PersonalitiesModel = require('../../models/dinocats/personalitiesModel');

module.exports = {
    async getAll(req, res) {
        try {
            const personalities = await PersonalitiesModel.getAll();
            res.json(personalities);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const personality = await PersonalitiesModel.getById(req.params.id);
            if (!personality) return res.status(404).json({ message: 'Personality not found' });
            res.json(personality);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getByCode(req, res) {
        try {
            const personality = await PersonalitiesModel.getByCode(req.params.code);
            if (!personality) return res.status(404).json({ message: 'Personality not found' });
            res.json(personality);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getByEmotionId(req, res) {
        try {
            const personalities = await PersonalitiesModel.getByEmotionId(req.params.emotionId);
            res.json(personalities);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const personality = await PersonalitiesModel.insertPersonality(req.body);
            res.status(201).json(personality);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const personality = await PersonalitiesModel.updatePersonality(req.params.id, req.body);
            res.json(personality);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const personality = await PersonalitiesModel.deletePersonality(req.params.id);
            res.json(personality);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
