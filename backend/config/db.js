require('dotenv').config();
const { Pool } = require('pg')

const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: Number(process.env.PGPORT) || 5432,
});

(async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            birthday DATE NOT NULL,
            cpf VARCHAR(11) NOT NULL,
            description VARCHAR(255)
        );

        CREATE TABLE IF NOT EXISTS dinocats (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            personality VARCHAR(50) NOT NULL,
            hp_base INT NOT NULL DEFAULT 100,
            attack_base INT NOT NULL DEFAULT 20,
            defense_base INT NOT NULL DEFAULT 15,
            trauma INT DEFAULT 0,
            pride INT DEFAULT 0,
            anxienty INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS skills (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL,
            damage INT,
            cure INT
        );

        CREATE TABLE IF NOT EXISTS emotions (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            value INT NOT NULL CHECK (value >= 0 AND value <= 100)
        );
        
        CREATE TABLE IF NOT EXISTS dinocats_emotions (
            dinocat_id INT NOT NULL,
            emotion_id INT NOT NULL,
            PRIMARY KEY (dinocat_id, emotion_id),
            CONSTRAINT fk_dinocat
                FOREIGN KEY (dinocat_id) REFERENCES dinocats(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_emotion
                FOREIGN KEY (emocao_id) REFERENCES emotions(id)
                ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS dinocats_skills (
            dinocat_id INT NOT NULL,
            skill_id INT NOT NULL,
            PRIMARY KEY (dinocat_id, skill_id),
            CONSTRAINT fk_dinocat
                FOREIGN KEY (dinocat_id) REFERENCES dinocats(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_skill
                FOREIGN KEY (skill_id) REFERENCES skills(id)
                ON DELETE CASCADE
        );

    `);
})();



pool.connect().then(() => console.log("✅ Conectado ao PostgreSQL!"))
    .catch(err => console.error("❌ Erro ao conectar:", err));

module.exports = pool;