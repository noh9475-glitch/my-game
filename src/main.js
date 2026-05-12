import './style.css'
import { getTopScores, hasSupabaseConfig, submitScore } from './leaderboard.js'

document.querySelector('#app').innerHTML = `
<section class="shell">
  <header class="intro">
    <p class="eyebrow">Supabase test</p>
    <h1>Game leaderboard</h1>
    <p>Submit a test score, then load the shared top scores from your Supabase table.</p>
  </header>

  <section class="panel">
    <form id="score-form" class="score-form">
      <label>
        Player name
        <input id="player-name" name="playerName" type="text" maxlength="24" placeholder="Alex" required>
      </label>

      <label>
        Score
        <input id="score" name="score" type="number" min="0" step="1" placeholder="100" required>
      </label>

      <button type="submit">Submit score</button>
    </form>

    <p id="status" class="status" role="status"></p>
  </section>

  <section class="panel">
    <div class="leaderboard-header">
      <h2>Top scores</h2>
      <button id="refresh-scores" type="button">Refresh</button>
    </div>

    <ol id="leaderboard" class="leaderboard"></ol>
  </section>
</section>
`

const scoreForm = document.querySelector('#score-form')
const statusEl = document.querySelector('#status')
const leaderboardEl = document.querySelector('#leaderboard')
const refreshButton = document.querySelector('#refresh-scores')

function setStatus(message, type = '') {
  statusEl.textContent = message
  statusEl.dataset.type = type
}

function renderScores(scores) {
  if (!scores.length) {
    leaderboardEl.innerHTML = '<li class="empty">No scores yet.</li>'
    return
  }

  leaderboardEl.innerHTML = scores
    .map(
      (score) => `
        <li>
          <span>${score.player_name}</span>
          <strong>${score.score}</strong>
        </li>
      `,
    )
    .join('')
}

async function loadScores() {
  if (!hasSupabaseConfig) {
    setStatus('Add your Supabase URL and anon key to my-game/.env, then restart npm run dev.', 'warning')
    renderScores([])
    return
  }

  setStatus('Loading scores...')

  try {
    const scores = await getTopScores()
    renderScores(scores)
    setStatus('Leaderboard loaded.', 'success')
  } catch (error) {
    setStatus(error.message, 'error')
  }
}

scoreForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  const formData = new FormData(scoreForm)
  const playerName = formData.get('playerName').trim()
  const score = Number(formData.get('score'))

  if (!playerName || Number.isNaN(score)) return

  setStatus('Submitting score...')

  try {
    await submitScore(playerName, score)
    scoreForm.reset()
    setStatus('Score submitted.', 'success')
    await loadScores()
  } catch (error) {
    setStatus(error.message, 'error')
  }
})

refreshButton.addEventListener('click', loadScores)

loadScores()
