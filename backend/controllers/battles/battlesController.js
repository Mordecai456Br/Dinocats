const BattlesModel = require('../../models/battles/battlesModel');
const UsersModel = require('../../models/users/usersModel');

module.exports = {
    async getAll(req, res) {
        try {
            const battles = await BattlesModel.getAll();
            res.json(battles);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const battle = await BattlesModel.getById(req.params.id);
            if (!battle) return res.status(404).json({ message: 'Battle not found' });
            res.json(battle);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const user1 = await UsersModel.getById(req.body.user1_id)

            if (user1.is_on_battle_mode) return res.status(403).json({ message: `${user1.name} (${user1.id}) is on battle mode` })
            const pendingBattle_user1 = await UsersModel.userPendingBattle(user1.id)
            if (pendingBattle_user1) return res.status(403).json({ message: `${user1.name} (${user1.id}) has a pending battle` })

            const user2 = await UsersModel.getById(req.body.user2_id)
            const pendingBattle_user2 = await UsersModel.userPendingBattle(user2.id)
            if (pendingBattle_user2) return res.status(403).json({ message: `${user2.name} (${user2.id}) has a pending battle` })

            const battle = await BattlesModel.create(req.body);
            return res.status(201).json({ battle, message: 'battle has been created' });

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
