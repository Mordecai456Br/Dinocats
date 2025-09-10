// backend/config/createTables.js
const supabase = require('./supabaseClient');

async function createTables() {
  try {
    // USERS
    await supabase.rpc('sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          birthday DATE NOT NULL,
          cpf VARCHAR(11) NOT NULL,
          password VARCHAR(40) NOT NULL,
          is_on_battle_mode BOOLEAN DEFAULT FALSE
        );
      `
    });

    // INVITES
    await supabase.rpc('sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS invites (
          id SERIAL PRIMARY KEY,
          user1_id INT NOT NULL,
          user2_id INT NOT NULL,
          accepted BOOLEAN DEFAULT FALSE,
          opencase BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          replied_at TIMESTAMP NULL,
          FOREIGN KEY (user1_id) REFERENCES users(id),
          FOREIGN KEY (user2_id) REFERENCES users(id)
        );
      `
    });

    // E assim por diante para as outras tabelas...
    
    console.log('✅ Tabelas criadas com Supabase JS!');
  } catch (err) {
    console.error('❌ Erro ao criar tabelas:', err);
  }
}

createTables();
