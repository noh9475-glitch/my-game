import './style.css'

document.querySelector('#app').innerHTML = `
  <main class="black-room" aria-labelledby="game-title">
    <button id="back-button" class="back-button" type="button" aria-label="Back to start">Back</button>

    <section class="room-stage" aria-hidden="true">
      <div class="projector">
        <div class="screen-glow"></div>
        <div class="screen-bar"></div>
        <div class="screen"></div>
        <div class="screen-pull"></div>
      </div>

      <div class="desks">
        ${Array.from(
          { length: 12 },
          (_, index) => `
            <div class="desk ${index === 4 ? 'focus-desk' : ''}">
              ${index === 4 ? `
                <div class="open-book">
                  <div class="book-page left-page"></div>
                  <div class="book-page right-page"></div>
                </div>
                <div class="pen"></div>
              ` : ''}
            </div>
          `,
        ).join('')}
      </div>
    </section>

    <section class="title-panel" aria-label="Start screen">
      <p class="kicker">After lights out</p>
      <h1 id="game-title">The Black Room</h1>
      <p class="tagline">One desk is waiting. The book is already open.</p>
      <button id="start-button" class="start-button" type="button">Start</button>
    </section>

    <section class="book-login" aria-label="Student login">
      <div class="login-book">
        <div class="book-spine"></div>

        <div class="book-sheet book-left">
          <p class="book-label">The Black Room</p>
          <h2>Student Record</h2>
          <p class="scribble line-one"></p>
          <p class="scribble line-two"></p>
          <p class="scribble line-three"></p>
        </div>

        <form class="book-sheet book-right">
          <label>
            Student name
            <input type="text" name="student-name" autocomplete="username" placeholder="Reuben">
          </label>

          <label>
            Student access code
            <input type="password" name="access-code" autocomplete="current-password" placeholder="0000">
          </label>

          <button type="button">Enter</button>
        </form>
      </div>
    </section>
  </main>
`

const startButton = document.querySelector('#start-button')
const backButton = document.querySelector('#back-button')
const screen = document.querySelector('.black-room')

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
