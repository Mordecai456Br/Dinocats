const pool = require('../../config/db');
const table = 'dinocats_skills';

module.exports = {
    async findAll() {
        const { rows } = await pool.query(`SELECT * FROM ${table}`);
        return rows;
    },

    async findById(dinocat_id, skill_id) {
        const { rows } = await pool.query(`SELECT * FROM ${table} WHERE dinocat_id = $1 AND skill_id = $2`, [dinocat_id, skill_id]);
        return rows[0];
    },

    async insertSkillIntoDinocat({ dinocat_id, skill_id }) {
        const { rows } = await pool.query(`
            INSERT INTO ${table} (dinocat_id, skill_id)
            VALUES ($1,$2)
            RETURNING *`,
            [dinocat_id, skill_id]
        );
        return rows[0];
    },

    async removeSkillIntoDinocat(dinocat_id, skill_id) {
        const { rows } = await pool.query(`DELETE FROM ${table} WHERE dinocat_id = $1 AND skill_id = $2 RETURNING *`, [dinocat_id, skill_id]);
        return rows[0];
    }
};
