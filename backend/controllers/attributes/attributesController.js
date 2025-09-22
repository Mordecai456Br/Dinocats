const AttributesModel = require('../../models/attributes/attributesModel');

module.exports = {
    async getAll(req, res) {
        try {
            const attributes = await AttributesModel.getAll();
            res.json(attributes);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const attribute = await AttributesModel.getById(req.params.id);
            if (!attribute) return res.status(404).json({ message: 'Attribute not found' });
            res.json(attribute);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const newAttribute = await AttributesModel.create(req.body);
            res.status(201).json(newAttribute);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const updatedAttribute = await AttributesModel.update(req.params.id, req.body);
            if (!updatedAttribute) return res.status(404).json({ message: 'Attribute not found' });
            res.json(updatedAttribute);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const deletedAttribute = await AttributesModel.remove(req.params.id);
            if (!deletedAttribute) return res.status(404).json({ message: 'Attribute not found' });
            res.json({ message: 'Attribute deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};