const pool = require('../../config/db');
const table = 'battles';

module.exports = {
    async findAll() {
        const { rows } = await pool.query(`SELECT * FROM ${table}`);
        return rows;
    },

    async findById(id) {
        const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
        return rows[0];
    },

    async create({ user1_id, user2_id, dinocat1_id, dinocat2_id, winner_id = null }) {
        const { rows } = await pool.query(`
            INSERT INTO ${table} (user1_id, user2_id, dinocat1_id, dinocat2_id, winner_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [user1_id, user2_id, dinocat1_id, dinocat2_id, winner_id]
        );
        return rows[0];
    },

    async updateWinner(id, winner_id) {
        const { rows } = await pool.query(`
            UPDATE ${table}
            SET winner_id = $2
            WHERE id = $1
            RETURNING *`,
            [id, winner_id]
        );
        return rows[0];
    },

    async remove(id) {
        const { rows } = await pool.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
        return rows[0];
    }
};
