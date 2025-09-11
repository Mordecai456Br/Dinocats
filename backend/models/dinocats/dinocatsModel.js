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
    const { data, error } = await supabase.from(table).select('*').eq('user_id', user_id).single();
    if (error) throw error;
    return data;
  },

  async create({ name, personality, hp_base = 100, attack_base = 20, defense_base = 15, trauma = 0, pride = 0, anxienty = 0, user_id = null }) {
    const { data, error } = await supabase
      .from(table)
      .insert([{ name, personality, hp_base, attack_base, defense_base, trauma, pride, anxienty, user_id }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, { name, personality, hp_base, attack_base, defense_base, trauma, pride, anxienty }) {
    const { data, error } = await supabase
      .from(table)
      .update({
        name,
        personality,
        hp_base,
        attack_base,
        defense_base,
        trauma,
        pride,
        anxienty
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
