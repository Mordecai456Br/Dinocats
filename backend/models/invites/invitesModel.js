const pool = require('../../config/db');
const table = 'invites';

module.exports = {
    async findAll() {
        const { rows } = await pool.query(`SELECT * FROM ${table}`);
        return rows;
    },

    async findById(id) {
        const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
        return rows[0];
    },

    async getUserInvites(user_id) {
        const { rows } = await pool.query(`SELECT * FROM ${table} WHERE user2_id = $1`, [user_id]);
        return rows;
    },

    async getOpenInvites(user2_id) {
        const { rows } = await pool.query(`SELECT * FROM ${table} WHERE user2_id = $1 AND opencase = true`, [user2_id]);
        return rows;
    },

    async create({ user1_id, user2_id, accepted = false, opencase = true }) {
        const { rows } = await pool.query(`
            INSERT INTO ${table} (user1_id, user2_id, accepted, opencase)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [user1_id, user2_id, accepted, opencase]
        );
        return rows[0];
    },

    async update(id, { accepted, opencase }) {
        const { rows } = await pool.query(`
            UPDATE ${table}
            SET 
            accepted = COALESCE($2, accepted),
            opencase = COALESCE($3, opencase)
            WHERE id = $1
            RETURNING *`,
            [id, accepted ?? null, opencase ?? null]
        );
        return rows[0];
    },

    async remove(id) {
        const { rows } = await pool.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
        return rows[0];
    }
};
