const pool = require('../../config/db');
const table = 'dinocats';

module.exports = {
    async findAll() {
        const { rows } = await pool.query(`SELECT * FROM ${table}`);
        return rows;
    },

    async findById(id) {
        const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
        return rows[0];
    },

    async create({ name, personality, hp_base, attack_base, defense_base, trauma, pride, anxienty }) {
        const { rows } = await pool.query(`
            INSERT INTO ${table} 
            (name, personality, hp_base, attack_base, defense_base, trauma, pride, anxienty)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *`,
            [name, personality, hp_base, attack_base, defense_base, trauma, pride, anxienty]
        );
        return rows[0];
    },

    async update(id, { name, personality, hp_base, attack_base, defense_base, trauma, pride, anxienty }) {
        const { rows } = await pool.query(`
            UPDATE ${table}
            SET name = COALESCE($2, name),
                personality = COALESCE($3, personality),
                hp_base = COALESCE($4, hp_base),
                attack_base = COALESCE($5, attack_base),
                defense_base = COALESCE($6, defense_base),
                trauma = COALESCE($7, trauma),
                pride = COALESCE($8, pride),
                anxienty = COALESCE($9, anxienty)
            WHERE id = $1
            RETURNING *`,
            [id, name ?? null, personality ?? null, hp_base ?? null, attack_base ?? null, defense_base ?? null, trauma ?? null, pride ?? null, anxienty ?? null]
        );
        return rows[0];
    },

    async remove(id) {
        const { rows } = await pool.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
        return rows[0];
    }
};
