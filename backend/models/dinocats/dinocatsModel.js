const supabase = require('../../config/supabaseClient');
const table = 'dinocats';

module.exports = {
  async getAll() {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async getDinocatsByUserId(user_id) {
    const { data, error } = await supabase.from(table).select('*').eq('user_id', user_id);
    if (error) throw error;
    return data;
  },

  async create({ name, user_id, kills, deaths, level, xp }) {
    const { data, error } = await supabase
      .from(table)
      .insert([{ name, user_id, kills, deaths, level, xp }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, { name, user_id, kills, deaths, level, xp}) {
    const { data, error } = await supabase
      .from(table)
      .update({
        name,
        user_id,
        kills,
        deaths,
        level,
        xp
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
