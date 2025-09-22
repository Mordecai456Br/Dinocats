const pool = require('../../../config/db');
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

    async create({ name, type, value, emotions_attributes_id }) {
        const { rows } = await pool.query(`
        INSERT INTO ${table} (name, type, value, emotions_attributes_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
            [name, type, value, emotions_attributes_id]
        );
        return rows[0];
    },

    async update(id, { name, type, value, emotions_attributes_id }) {
        const { rows } = await pool.query(`
        UPDATE ${table}
        SET 
            name = COALESCE($2, name),
            type = COALESCE($3, type),
            value = COALESCE($4, value),
            emotions_attributes_id = COALESCE($5, emotions_attributes_id)
        WHERE id = $1
        RETURNING *`,
            [id, name ?? null, type ?? null, value ?? null, emotions_attributes_id ?? null]
        );
        return rows[0];
    },

    async remove(id) {
        const { rows } = await pool.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
        return rows[0];
    }
};
