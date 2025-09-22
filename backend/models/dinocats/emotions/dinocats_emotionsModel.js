const pool = require('../../../config/db');
const table = 'dinocats_emotions';

module.exports = {
    async getAll() {
        const { rows } = await pool.query(`SELECT * FROM ${table}`);
        return rows;
    },

    async getById(dinocat_id, emotions_attributes_id) {
        const { rows } = await pool.query(
            `SELECT * FROM ${table} WHERE dinocat_id = $1 AND emotions_attributes_id = $2`,
            [dinocat_id, emotions_attributes_id]
        );
        return rows[0];
    },

    async insertEmotionIntoDinocat({ dinocat_id, emotions_attributes_id }) {
        const { rows } = await pool.query(`
            INSERT INTO ${table} (dinocat_id, emotions_attributes_id)
            VALUES ($1,$2)
            RETURNING *`,
            [dinocat_id, emotions_attributes_id]
        );
        return rows[0];
    },

    async removeEmotionFromDinocat(dinocat_id, emotions_attributes_id) {
        const { rows } = await pool.query(
            `DELETE FROM ${table} WHERE dinocat_id = $1 AND emotions_attributes_id = $2 RETURNING *`,
            [dinocat_id, emotions_attributes_id]
        );
        return rows[0];
    }
};
