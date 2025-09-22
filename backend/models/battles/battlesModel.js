const supabase = require('../../config/supabaseClient'); // seu client supabase-js

const table = 'battles';

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

  

  async create({ user1_id, user2_id, dinocat1_id, dinocat2_id, winner_id, started_at, ended_at, invite_id, status="pending" }) {
    const { data, error } = await supabase
      .from(table)
      .insert([{ user1_id, user2_id, dinocat1_id, dinocat2_id, winner_id, started_at, ended_at, invite_id, status }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateWinner(id, winner_id) {
    const { data, error } = await supabase
      .from(table)
      .update({ winner_id,
        status: 'finished',
        ended_at: new Date().toISOString()
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
