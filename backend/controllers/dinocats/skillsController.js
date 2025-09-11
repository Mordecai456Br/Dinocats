const SkillsModel = require('../../models/dinocats/skillsModel');

module.exports = {
    async getAll(req, res) {
        try {
            const skills = await SkillsModel.getAll();
            res.json(skills);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const skill = await SkillsModel.getById(req.params.id);
            if (!skill) return res.status(404).json({ message: 'Skill not found' });
            res.json(skill);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const skill = await SkillsModel.create(req.body);
            res.status(201).json(skill);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const skill = await SkillsModel.update(req.params.id, req.body);
            res.json(skill);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const skill = await SkillsModel.remove(req.params.id);
            res.json(skill);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async insertIntoDinocat(req, res) {
        try {
            const { dinocat_id, skill_id } = req.body;
            const association = await SkillsModel.insertSkillIntoDinocat({ dinocat_id, skill_id });
            res.status(201).json(association);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async removeFromDinocat(req, res) {
        try {
            const { dinocat_id, skill_id } = req.body;
            const removed = await SkillsModel.removeSkillFromDinocat(dinocat_id, skill_id);
            res.json(removed);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
