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

    async create({ user1_id, user2_id, dinocat1_id, dinocat2_id, accepted = false }) {
        const { rows } = await pool.query(`
            INSERT INTO ${table} (user1_id, user2_id, dinocat1_id, dinocat2_id, accepted)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [user1_id, user2_id, dinocat1_id, dinocat2_id, accepted]
        );
        return rows[0];
    },

    async update(id, { accepted }) {
        const { rows } = await pool.query(`
            UPDATE ${table}
            SET accepted = COALESCE($2, accepted)
            WHERE id = $1
            RETURNING *`,
            [id, accepted ?? null]
        );
        return rows[0];
    },

    async remove(id) {
        const { rows } = await pool.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
        return rows[0];
    }
};
