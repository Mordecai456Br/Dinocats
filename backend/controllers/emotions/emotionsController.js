const EmotionsModel = require('../../models/emotions/emotionsModel');

module.exports = {
    async getAll(req, res) {
        try {
            const emotions = await EmotionsModel.getAll();
            res.json(emotions);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const emotion = await EmotionsModel.getById(req.params.id);
            if (!emotion) return res.status(404).json({ message: 'Emotion not found' });
            res.json(emotion);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const emotion = await EmotionsModel.create(req.body);
            res.status(201).json(emotion);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const emotion = await EmotionsModel.update(req.params.id, req.body);
            res.json(emotion);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const emotion = await EmotionsModel.remove(req.params.id);
            res.json(emotion);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async insertIntoDinocat(req, res) {
        try {
            const { dinocat_id, emotion_id } = req.body;
            const association = await EmotionsModel.insertEmotionIntoDinocat({ dinocat_id, emotion_id });
            res.status(201).json(association);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async removeFromDinocat(req, res) {
        try {
            const { dinocat_id, emotion_id } = req.body;
            const removed = await EmotionsModel.removeEmotionFromDinocat(dinocat_id, emotion_id);
            res.json(removed);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
