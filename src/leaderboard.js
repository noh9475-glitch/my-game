import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

function requireSupabaseConfig() {
  if (!supabase) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  }
}

export async function submitScore(playerName, score) {
  requireSupabaseConfig()

  const { error } = await supabase.from('scores').insert({
    player_name: playerName,
    score,
  })

  if (error) throw error
}

export async function getTopScores(limit = 10) {
  requireSupabaseConfig()

  const { data, error } = await supabase
    .from('scores')
    .select('player_name, score, created_at')
    .order('score', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
