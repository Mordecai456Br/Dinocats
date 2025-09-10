// backend/config/db.js
/* require('dotenv').config();
const { Pool } = require('pg');

// Configuração do Pool
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT) || 5432,
});

// Função para criar todas as tabelas
async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        birthday DATE NOT NULL,
        cpf VARCHAR(11) NOT NULL,
        password VARCHAR(40) NOT NULL,
        is_on_battle_mode BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS invites (
        id SERIAL PRIMARY KEY,
        user1_id INT NOT NULL,
        user2_id INT NOT NULL,
        accepted BOOLEAN DEFAULT FALSE,
        opencase BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        replied_at TIMESTAMP DEFAULT NULL,
        FOREIGN KEY (user1_id) REFERENCES users(id),
        FOREIGN KEY (user2_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS battles (
        id SERIAL PRIMARY KEY,
        user1_id INT NOT NULL,
        user2_id INT NOT NULL,
        dinocat1_id INT NOT NULL,
        dinocat2_id INT NOT NULL,
        winner_id INT,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id INT,
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
        CONSTRAINT fk_dinocat FOREIGN KEY (dinocat_id) REFERENCES dinocats(id) ON DELETE CASCADE,
        CONSTRAINT fk_emotion FOREIGN KEY (emotion_id) REFERENCES emotions(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS dinocats_skills (
        dinocat_id INT NOT NULL,
        skill_id INT NOT NULL,
        PRIMARY KEY (dinocat_id, skill_id),
        CONSTRAINT fk_dinocat FOREIGN KEY (dinocat_id) REFERENCES dinocats(id) ON DELETE CASCADE,
        CONSTRAINT fk_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
      );
    `);

    console.log('✅ Todas as tabelas foram criadas com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao criar tabelas:', err);
  }
}

// Chama a função de criação de tabelas automaticamente
createTables();

// Exporta o pool para usar no resto da aplicação
module.exports = pool;
*/