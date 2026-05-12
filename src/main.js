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
        <h2>Black Room Entry Document</h2>
        <p class="document-warning">Print clearly. The room will remember your name.</p>

        <label>
          Student name
          <input type="text" name="student-name" autocomplete="username" placeholder="Student 01">
        </label>

        <button type="button">Enter</button>
      </form>
    </section>
  </main>
`

const startButton = document.querySelector('#start-button')
const backButton = document.querySelector('#back-button')
const screen = document.querySelector('.black-room')
const sceneShell = document.querySelector('.scene-shell')

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
  screen.classList.remove('is-login')

  window.setTimeout(() => {
    screen.classList.remove('is-zooming')
  }, 120)
})
