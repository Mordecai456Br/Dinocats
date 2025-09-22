const pool = require('../../../config/db');
const table = 'dinocats_attributes';

module.exports = {
    
    async getAll() {
        const { rows } = await pool.query(`SELECT * FROM ${table}`);
        return rows;
    },

    // 
    async getById(dinocat_id, attributes_id) {
        const { rows } = await pool.query(
            `SELECT * FROM ${table} WHERE dinocat_id = $1 AND attributes_id = $2`,
            [dinocat_id, attributes_id]
        );
        return rows[0];
    },

    //  add to attribute to dinocat
    async insertAttributeIntoDinocat({ dinocat_id, attributes_id, value }) {
        const { rows } = await pool.query(`
            INSERT INTO ${table} (dinocat_id, attributes_id, value)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [dinocat_id, attributes_id, value]
        );
        return rows[0];
    },

    //  remove attribute from dinocat
    async removeAttributeFromDinocat(dinocat_id, attributes_id) {
        const { rows } = await pool.query(
            `DELETE FROM ${table} WHERE dinocat_id = $1 AND attributes_id = $2 RETURNING *`,
            [dinocat_id, attributes_id]
        );
        return rows[0];
    }
};