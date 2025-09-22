const supabase = require('../../../config/supabaseClient'); 
const table = 'personalities';

module.exports = {
    async getAll() {
        const { rows } = await pool.query(`SELECT * FROM ${table}`);
        return rows;
    },

    async getByCode(personalityCode) {
        const { rows } = await pool.query(
            `SELECT * FROM ${table} WHERE personality_code = $1`,
            [personalityCode]
        );
        return rows[0];
    },

    async getByEmotionId(emotionId) {
        const { rows } = await pool.query(
            `SELECT * FROM ${table} WHERE emotion_id = $1`,
            [emotionId]
        );
        return rows;
    },

    async insertPersonality({ personality_code, name, emotion_id }) {
        const { rows } = await pool.query(
            `INSERT INTO ${table} (personality_code, name, emotion_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [personality_code, name, emotion_id]
        );
        return rows[0];
    },

    async updatePersonality(id, { personality_code, name, emotion_id }) {
        const { rows } = await pool.query(
            `UPDATE ${table} SET personality_code = $1, name = $2, emotion_id = $3 WHERE id = $4 RETURNING *`,
            [personality_code, name, emotion_id, id]
        );
        return rows[0];
    },

    async deletePersonality(id) {
        const { rows } = await pool.query(
            `DELETE FROM ${table} WHERE id = $1 RETURNING *`,
            [id]
        );
        return rows[0];
    }
};