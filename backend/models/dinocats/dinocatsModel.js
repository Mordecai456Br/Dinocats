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

  async getSkillsByDinocatId(dinocat_id) {
  const { data, error } = await supabase
    .from('dinocats_skills')
    .select(`
      skill_id,
      skills (
        name,
        type,
        value
      )
    `)
    .eq('dinocat_id', dinocat_id);

  if (error) throw error;

  // Mapeia para ficar compatível com o front
  return data.map(item => ({
    id: item.skill_id,
    name: item.skills.name,
    type: item.skills.type,
    damage: item.skills.value // aqui seu "damage" é o value
  }));
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

  async update(id, { name, user_id, kills, deaths, level, xp }) {
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
