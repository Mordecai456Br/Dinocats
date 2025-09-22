const UsersModel = require('../../models/users/usersModel');
const DinocatsModel = require('../../models/dinocats/dinocatsModel');

module.exports = {
  async getAll(req, res) {
    try {
      const users = await UsersModel.getAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const user = await UsersModel.getById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  async userPendingBattle(req, res) {
    try {
      const user = await UsersModel.getById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const pendingBattle = await UsersModel.userPendingBattle(user.id);

      if(!pendingBattle){
        return res.json({ message: 'no pending battle found', battle: null})
      }
      res.json(pendingBattle);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getDinocatsByUserId(req, res) {
        try {
            const user = await UsersModel.getById(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const dinocats = await DinocatsModel.getDinocatsByUserId(user.id);
            res.json(dinocats);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

  async create(req, res) {
  console.log(req.body);
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

  async setBattleMode(req, res) {
    try {
      const { user1_id, user2_id, isOnBattleMode } = req.body;
      const users = await UsersModel.setBattleMode(user1_id, user2_id, isOnBattleMode);
      res.json(users);
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
