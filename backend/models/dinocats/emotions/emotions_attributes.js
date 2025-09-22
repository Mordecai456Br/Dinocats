const pool = require('../../../config/db');
const table = 'emotions_attributes';

module.exports = {
    /**
     * todas associações de emoções e atributos.
     */
    async getAll() {
        const { rows } = await pool.query(`SELECT * FROM ${table} ORDER BY id`);
        return rows;
    },

    /**
     * buscando by id...
     */
    async getById(id) {
        const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
        return rows[0];
    },
    
    /**
     * aqui busca todos os modificadores de atributos para uma emoção específica.
     */
    async getByEmotionId(emotionId) {
        const { rows } = await pool.query(`SELECT * FROM ${table} WHERE emotion_id = $1`, [emotionId]);
        return rows;
    },

    /**
     * criando uma nova associação (um novo efeito de emoção em um atributo).
     */
    async create({ emotion_id, attributes_id, value, type }) {
        const { rows } = await pool.query(
            `INSERT INTO ${table} (emotion_id, attributes_id, value, type)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [emotion_id, attributes_id, value, type]
        );
        return rows[0];
    },

    async update(id, { emotion_id, attributes_id, value, type }) {
        const { rows } = await pool.query(
            `UPDATE ${table}
             SET 
                emotion_id = COALESCE($2, emotion_id),
                attributes_id = COALESCE($3, attributes_id),
                value = COALESCE($4, value),
                type = COALESCE($5, type)
             WHERE id = $1
             RETURNING *`,
            [id, emotion_id, attributes_id, value, type]
        );
        return rows[0];
    },

    async remove(id) {
        const { rows } = await pool.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
        return rows[0];
    }
};