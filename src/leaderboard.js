import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function submitScore(playerName, score) {
  const { error } = await supabase.from('scores').insert({
    player_name: playerName,
    score,
  })

  if (error) throw error
}

export async function getTopScores(limit = 10) {
  const { data, error } = await supabase
    .from('scores')
    .select('player_name, score, created_at')
    .order('score', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
