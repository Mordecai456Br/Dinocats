const supabase = require('../../config/supabaseClient'); // seu client supabase-js
const table = 'users';

module.exports = {
  async findAll() {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async create({ name, birthday, cpf, password }) {
    const { data, error } = await supabase.from(table).insert([{ name, birthday, cpf, password }]).select().single();
    if (error) throw error;
    return data;
  },

  async update(id, { name, birthday, cpf, password, is_on_battle_mode }) {
    const { data, error } = await supabase.from(table)
      .update({
        name,
        birthday,
        cpf,
        password,
        is_on_battle_mode
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async setBattleMode(user1_id, user2_id, isOnBattleMode) {
    const { data, error } = await supabase.from(table)
      .update({ is_on_battle_mode: isOnBattleMode })
      .in('id', [user1_id, user2_id])
      .select();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { data, error } = await supabase.from(table).delete().eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
};
