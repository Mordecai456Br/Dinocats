const pool = require('../db');
const table = 'dinocats_emotions';

module.exports = {
    async findAll() {
        const { rows } = await pool.query(`SELECT * FROM ${table}`);
        return rows;
    },

    async findById(dinocat_id, emotion_id) {
        const { rows } = await pool.query(
            `SELECT * FROM ${table} WHERE dinocat_id = $1 AND emotion_id = $2`,
            [dinocat_id, emotion_id]
        );
        return rows[0];
    },

    async insertEmotionIntoDinocat({ dinocat_id, emotion_id }) {
        const { rows } = await pool.query(`
            INSERT INTO ${table} (dinocat_id, emotion_id)
            VALUES ($1,$2)
            RETURNING *`,
            [dinocat_id, emotion_id]
        );
        return rows[0];
    },

    async removeEmotionFromDinocat(dinocat_id, emotion_id) {
        const { rows } = await pool.query(
            `DELETE FROM ${table} WHERE dinocat_id = $1 AND emotion_id = $2 RETURNING *`,
            [dinocat_id, emotion_id]
        );
        return rows[0];
    }
};
