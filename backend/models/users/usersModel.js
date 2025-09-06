const pool = require('../../config/db');
const table = 'users';

module.exports = {
    async findAll() {
        const { rows } = await pool.query(`SELECT * FROM ${table}`);
        return rows;
    },

    async findById(id) {
        const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
        return rows[0];
    },

    async create({ name, birthday, cpf, password }) {
        const { rows } = await pool.query(`
            INSERT INTO ${table} (name, birthday, cpf, password)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [name, birthday, cpf, password]
        );
        return rows[0];
    },

    async update(id, { name, birthday, cpf, password }) {
        const { rows } = await pool.query(`
            UPDATE ${table}
            SET name = COALESCE($2, name),
                birthday = COALESCE($3, birthday),
                cpf = COALESCE($4, cpf),
                password = COALESCE($5, password)
            WHERE id = $1
            RETURNING *`,
            [id, name ?? null, birthday ?? null, cpf ?? null, password ?? null]
        );
        return rows[0];
    },

    async remove(id) {
        const { rows } = await pool.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
        return rows[0];
    }
};
