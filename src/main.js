import './style.css'

document.querySelector('#app').innerHTML = `
  <main class="login-screen" aria-labelledby="game-title">
    <section class="room" aria-hidden="true">
      <div class="projector">
        <div class="screen-glow"></div>
        <div class="screen-bar"></div>
        <div class="screen"></div>
        <div class="screen-pull"></div>
      </div>

      <div class="desks">
        ${Array.from({ length: 12 }, (_, index) => `<div class="desk desk-${index + 1}"></div>`).join('')}
      </div>
    </section>

    <section class="login-panel" aria-label="Login">
      <p class="kicker">Enter quietly</p>
      <h1 id="game-title">The Black Room</h1>
      <p class="tagline">A classroom after the lights go out. Every desk remembers who sat there.</p>

      <form class="login-form">
        <label>
          Codename
          <input type="text" name="codename" placeholder="Student 07" autocomplete="username">
        </label>

        <label>
          Access phrase
          <input type="password" name="password" placeholder="Not connected yet" autocomplete="current-password">
        </label>

        <button type="button">Begin</button>
      </form>
    </section>
  </main>
`
