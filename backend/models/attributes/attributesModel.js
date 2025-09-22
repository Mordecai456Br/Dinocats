const pool = require('../../config/db'); 
const table = 'attributes';

module.exports = {
  
    async getAll() {
        const { rows } = await pool.query(`SELECT * FROM ${table} ORDER BY id`);
        return rows;
    },


    async getById(id) {
        const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
        return rows[0];
    },

    async create({ name }) { 
        const { rows } = await pool.query(
            `INSERT INTO ${table} (name) VALUES ($1) RETURNING *`,
            [name]
        );
        return rows[0];
    },

    async update(id, { name }) {
        const { rows } = await pool.query(
            `UPDATE ${table} SET name = $1 WHERE id = $2 RETURNING *`,
            [name, id]
        );
        return rows[0];
    },

    async remove(id) {
        const { rows } = await pool.query(
            `DELETE FROM ${table} WHERE id = $1 RETURNING *`,
            [id]
        );
        return rows[0];
    }
};