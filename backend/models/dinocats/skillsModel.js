const pool = require('../../config/db');
const table = 'skills';

module.exports = {
    async getAll() {
        const { rows } = await pool.query(`SELECT * FROM ${table}`);
        return rows;
    },

    async getById(id) {
        const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
        return rows[0];
    },

    async create({ name, type, damage, cure }) {
        const { rows } = await pool.query(`
            INSERT INTO ${table} (name, type, damage, cure)
            VALUES ($1,$2,$3,$4)
            RETURNING *`,
            [name, type, damage, cure]
        );
        return rows[0];
    },

    async update(id, { name, type, damage, cure }) {
        const { rows } = await pool.query(`
            UPDATE ${table}
            SET name = COALESCE($2, name),
                type = COALESCE($3, type),
                damage = COALESCE($4, damage),
                cure = COALESCE($5, cure)
            WHERE id = $1
            RETURNING *`,
            [id, name ?? null, type ?? null, damage ?? null, cure ?? null]
        );
        return rows[0];
    },

    async remove(id) {
        const { rows } = await pool.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
        return rows[0];
    }
};
