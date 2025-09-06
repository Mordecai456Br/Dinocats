const pool = require('../../config/db');
const table = 'emotions';

module.exports = {
    async findAll() {
        const { rows } = await pool.query(`SELECT * FROM ${table}`);
        return rows;
    },

    async findById(id) {
        const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
        return rows[0];
    },

    async create({ name, value }) {
        const { rows } = await pool.query(`
            INSERT INTO ${table} (name, value)
            VALUES ($1,$2)
            RETURNING *`,
            [name, value]
        );
        return rows[0];
    },

    async update(id, { name, value }) {
        const { rows } = await pool.query(`
            UPDATE ${table}
            SET name = COALESCE($2, name),
                value = COALESCE($3, value)
            WHERE id = $1
            RETURNING *`,
            [id, name ?? null, value ?? null]
        );
        return rows[0];
    },

    async remove(id) {
        const { rows } = await pool.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
        return rows[0];
    }
};
