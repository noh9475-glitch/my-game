import './style.css'

document.querySelector('#app').innerHTML = `
  <main class="black-room" aria-label="The Black Room">
    <button id="back-button" class="back-button" type="button" aria-label="Back to start">Back</button>

    <div class="scene-shell">
      <section class="room-stage" aria-hidden="true">
        <div class="projector">
          <div class="screen-glow"></div>
          <div class="screen-bar"></div>
          <div class="screen">
            <p>Welcome to</p>
            <strong>The Black Room</strong>
          </div>
          <div class="screen-pull"></div>
        </div>

        <div class="desks">
          ${Array.from(
            { length: 12 },
            (_, index) => `
              <div class="desk ${index === 10 ? 'focus-desk' : ''}">
                ${index === 10 ? `
                  <div class="desk-paper"></div>
                ` : ''}
              </div>
            `,
          ).join('')}
        </div>
      </section>

      <section class="title-panel" aria-label="Start screen">
        <p class="tagline">One desk awaits. Your exam has already begun.</p>
        <button id="start-button" class="start-button" type="button">Begin</button>
      </section>
    </div>

    <section class="document-login" aria-label="Student login">
      <form class="exam-document">
        <p class="document-code">Form BR-01</p>
        <div class="stamp-mark" aria-live="polite">
          <span>Black</span>
          <span>Room</span>
          <span>Entry</span>
          <span>Confirmed</span>
        </div>
        <h2>Black Room Entry Document</h2>
        <p class="document-warning">Print clearly. The room will remember your name.</p>

        <label>
          Student name
          <input type="text" name="student-name" autocomplete="username" placeholder="Student 01">
        </label>

        <button id="submit-form-button" type="button">Submit Form</button>
      </form>
    </section>

    <section class="character-exam" aria-label="Character creation entry exam">
      <form class="character-sheet">
        <p class="document-code">Entry Exam CC-01</p>
        <h2>Character Creation Entry Exam</h2>
        <p class="document-warning">Assign exactly fifteen points before the room decides for you.</p>

        <div class="points-panel" aria-live="polite">
          <span>Points remaining</span>
          <strong id="points-remaining">15</strong>
        </div>

        <div class="exam-body">
          <div class="stat-list" aria-label="Entry exam stats">
            ${['Charisma', 'Intell', 'Strength', 'Stamina', 'Knowledge'].map((stat) => `
              <label class="stat-control">
                <span>${stat}</span>
                <input type="range" name="${stat.toLowerCase()}" min="0" max="15" value="0" step="1" data-stat-slider>
                <output>0</output>
              </label>
            `).join('')}
          </div>

          <div class="exam-extension-space">
            <h3>Additional Assessment</h3>
            <div class="exam-lines" aria-hidden="true"></div>
          </div>
        </div>

        <button id="finalize-character-button" type="button">Finalize Entry</button>
      </form>
    </section>
  </main>
`

const startButton = document.querySelector('#start-button')
const backButton = document.querySelector('#back-button')
const submitFormButton = document.querySelector('#submit-form-button')
const finalizeCharacterButton = document.querySelector('#finalize-character-button')
const screen = document.querySelector('.black-room')
const sceneShell = document.querySelector('.scene-shell')
const stampMark = document.querySelector('.stamp-mark')
const statSliders = [...document.querySelectorAll('[data-stat-slider]')]
const pointsRemaining = document.querySelector('#points-remaining')
const statPointLimit = 15

const fitScene = () => {
  const scale = Math.min(window.innerWidth / 1000, window.innerHeight / 900)
  sceneShell.style.setProperty('--scene-scale', Math.min(scale, 1).toFixed(4))
}

fitScene()
window.addEventListener('resize', fitScene)

startButton.addEventListener('click', () => {
  screen.classList.add('is-zooming')

  window.setTimeout(() => {
    screen.classList.add('is-login')
  }, 900)
})

backButton.addEventListener('click', () => {
  screen.classList.remove('is-exam')
  screen.classList.remove('is-login')

  window.setTimeout(() => {
    screen.classList.remove('is-zooming')
  }, 120)
})

submitFormButton.addEventListener('click', () => {
  stampMark.classList.remove('is-stamped')
  void stampMark.offsetWidth
  stampMark.classList.add('is-stamped')

  window.setTimeout(() => {
    screen.classList.add('is-exam')
  }, 760)
})

const updateStatPoints = (changedSlider) => {
  const spentBeforeChange = statSliders
    .filter((slider) => slider !== changedSlider)
    .reduce((total, slider) => total + Number(slider.value), 0)

  const allowedValue = Math.min(Number(changedSlider.value), statPointLimit - spentBeforeChange)
  changedSlider.value = String(allowedValue)

  const spent = statSliders.reduce((total, slider) => {
    const value = Number(slider.value)
    slider.nextElementSibling.value = value
    return total + value
  }, 0)

  pointsRemaining.textContent = statPointLimit - spent
  const pointsComplete = spent === statPointLimit
  screen.classList.toggle('is-points-complete', pointsComplete)
  finalizeCharacterButton.disabled = !pointsComplete
}

statSliders.forEach((slider) => {
  slider.addEventListener('input', () => updateStatPoints(slider))
})

finalizeCharacterButton.disabled = true
