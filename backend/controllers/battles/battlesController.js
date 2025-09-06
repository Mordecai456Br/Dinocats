const BattlesModel = require('../../models/battles/battlesModel');

module.exports = {
    async getAll(req, res) {
        try {
            const battles = await BattlesModel.findAll();
            res.json(battles);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const battle = await BattlesModel.findById(req.params.id);
            if (!battle) return res.status(404).json({ message: 'Battle not found' });
            res.json(battle);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const battle = await BattlesModel.create(req.body);
            res.status(201).json(battle);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async updateWinner(req, res) {
        try {
            const battle = await BattlesModel.updateWinner(req.params.id, req.body.winner_id);
            res.json(battle);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const battle = await BattlesModel.remove(req.params.id);
            res.json(battle);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
