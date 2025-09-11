const supabase = require('../../config/supabaseClient'); // seu client Supabase
const table = 'invites';

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

  async getUserInvites(user_id) {
    const { data, error } = await supabase.from(table).select('*').eq('user2_id', user_id);
    if (error) throw error;
    return data;
  },

  async getOpenInvites(user2_id) {
    const { data, error } = await supabase.from(table)
      .select('*')
      .eq('user2_id', user2_id)
      .eq('opencase', true);
    if (error) throw error;
    return data;
  },

  async create({ user1_id, user2_id, accepted = false, opencase = true }) {
    const { data, error } = await supabase.from(table)
      .insert([{ user1_id, user2_id, accepted, opencase }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, { user2_id, accepted, opencase }) {
    const { data, error } = await supabase.from(table)
      .update({
        user2_id: user2_id ?? null,
        accepted: accepted ?? false,
        opencase: opencase ?? true
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async acceptInvite(id, { accepted = true, opencase = false } = {}) {
    const { data, error } = await supabase.from(table)
      .update({
        accepted,
        opencase,
        replied_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { data, error } = await supabase.from(table)
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
