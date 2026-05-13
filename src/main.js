import './style.css'

const specializationSkills = [
  {
    name: 'Persuading',
    description: 'Your words find weak points. Teachers and classmates become easier to move.',
  },
  {
    name: 'Photographic Memory',
    description: 'Pages stay with you after one look. Study faster and hold steadier under test pressure.',
  },
  {
    name: 'Grand Master',
    description: 'You read the board before others see the game. Chess tactics and long plans sharpen.',
  },
  {
    name: 'True Understanding',
    description: 'You do not just memorize the lesson. You see why it works.',
  },
  {
    name: 'Unseen Manipulator',
    description: 'Your influence works from the edges of the room, noticed only after choices are made.',
  },
  {
    name: 'Classroom Leader',
    description: 'The class looks your way before it decides. Group pressure bends toward your call.',
  },
  {
    name: 'Elite Sportsman',
    description: 'Training shows in every sprint, contest, and recovery. Physical trials favor you.',
  },
  {
    name: 'Steroid Abuser',
    description: 'Power was borrowed at a cost. Strength rises, but the room keeps the receipt.',
  },
]

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

    <section class="character-exam" aria-label="Entry exam statistics page">
      <form class="character-sheet">
        <section class="exam-page stats-page" aria-label="Entry exam page one statistics">
          <div class="exam-meta">
            <p class="document-code">Entry Exam ST-01</p>
            <p class="page-number">Page 01</p>
          </div>
          <h2>Entry Exam</h2>
          <p class="document-warning">Declare your statistics for the room. Fifteen marks may be spent. None will be returned.</p>

          <div class="points-panel" aria-live="polite">
            <span>Points remaining</span>
            <strong id="points-remaining">15</strong>
          </div>

          <div class="exam-body">
            <div class="stat-list" aria-label="Entry exam stats">
              ${['Charisma', 'Intelligence', 'Strength', 'Stamina', 'Knowledge'].map((stat) => `
                <label class="stat-control">
                  <span>${stat}</span>
                  <input type="range" name="${stat.toLowerCase()}" min="0" max="15" value="0" step="1" data-stat-slider>
                  <output>0</output>
                </label>
              `).join('')}
            </div>
          </div>
        </section>

        <section class="exam-page specialization-page" aria-label="Entry exam page two specializations">
          <div class="exam-meta">
            <p class="document-code">Entry Exam SP-02</p>
            <p class="page-number">Page 02</p>
          </div>
          <h2>Specialization</h2>
          <p class="document-warning">Which skills answer when the room calls? Select two. No more. No less.</p>

          <div class="specialization-counter" aria-live="polite">
            <span>Selections remaining</span>
            <strong id="skills-remaining">2</strong>
          </div>

          <div class="skill-scroll" tabindex="0">
            <div class="skill-list" aria-label="Specialization skills">
              ${specializationSkills.map((skill) => `
                <label class="skill-option">
                  <input type="checkbox" name="specializations" value="${skill.name}" data-skill-option>
                  <span>
                    <strong>${skill.name}</strong>
                    <small>${skill.description}</small>
                  </span>
                </label>
              `).join('')}
            </div>
          </div>
        </section>

        <button id="turn-page-button" type="button">Turn The Page</button>
      </form>
    </section>
  </main>
`

const startButton = document.querySelector('#start-button')
const backButton = document.querySelector('#back-button')
const submitFormButton = document.querySelector('#submit-form-button')
const turnPageButton = document.querySelector('#turn-page-button')
const screen = document.querySelector('.black-room')
const sceneShell = document.querySelector('.scene-shell')
const stampMark = document.querySelector('.stamp-mark')
const statSliders = [...document.querySelectorAll('[data-stat-slider]')]
const skillOptions = [...document.querySelectorAll('[data-skill-option]')]
const pointsRemaining = document.querySelector('#points-remaining')
const skillsRemaining = document.querySelector('#skills-remaining')
const statPointLimit = 15
const skillSelectionLimit = 2
let suppressNextClick = false

const fitScene = () => {
  const scale = Math.min(window.innerWidth / 1000, window.innerHeight / 900)
  sceneShell.style.setProperty('--scene-scale', Math.min(scale, 1).toFixed(4))
}

fitScene()
window.addEventListener('resize', fitScene)

const isInteractiveElement = (element) => {
  const styles = window.getComputedStyle(element)

  return (
    styles.visibility !== 'hidden'
    && styles.display !== 'none'
    && Number(styles.opacity) > 0.05
    && !element.disabled
  )
}

const isPointInside = (event, element) => {
  const rect = element.getBoundingClientRect()

  return (
    event.clientX >= rect.left
    && event.clientX <= rect.right
    && event.clientY >= rect.top
    && event.clientY <= rect.bottom
  )
}

const runFromPointer = (event, element, action) => {
  if (!isInteractiveElement(element) || !isPointInside(event, element)) {
    return false
  }

  suppressNextClick = true
  event.preventDefault()
  action()
  window.setTimeout(() => {
    suppressNextClick = false
  }, 250)

  return true
}

const beginEntry = () => {
  screen.classList.add('is-zooming')

  window.setTimeout(() => {
    screen.classList.add('is-login')
  }, 900)
}

const goBack = () => {
  screen.classList.remove('is-specialization')
  screen.classList.remove('is-exam')
  screen.classList.remove('is-login')

  window.setTimeout(() => {
    screen.classList.remove('is-zooming')
  }, 120)
}

const submitEntryForm = () => {
  stampMark.classList.remove('is-stamped')
  void stampMark.offsetWidth
  stampMark.classList.add('is-stamped')

  window.setTimeout(() => {
    screen.classList.add('is-exam')
  }, 760)
}

const turnExamPage = () => {
  if (!screen.classList.contains('is-specialization')) {
    screen.classList.add('is-specialization')
    turnPageButton.textContent = 'Finalize Entry'
    turnPageButton.disabled = true
  }
}

const handleClick = (action) => (event) => {
  if (suppressNextClick) {
    event.preventDefault()
    return
  }

  action()
}

screen.addEventListener('pointerup', (event) => {
  runFromPointer(event, backButton, goBack)
    || runFromPointer(event, startButton, beginEntry)
    || runFromPointer(event, submitFormButton, submitEntryForm)
    || runFromPointer(event, turnPageButton, turnExamPage)
}, true)

startButton.addEventListener('click', handleClick(beginEntry))
backButton.addEventListener('click', handleClick(goBack))
submitFormButton.addEventListener('click', handleClick(submitEntryForm))

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
  turnPageButton.disabled = !pointsComplete
}

statSliders.forEach((slider) => {
  slider.addEventListener('input', () => updateStatPoints(slider))
})

const updateSkillSelections = () => {
  const selectedCount = skillOptions.filter((option) => option.checked).length
  const selectionsComplete = selectedCount === skillSelectionLimit

  skillsRemaining.textContent = skillSelectionLimit - selectedCount
  screen.classList.toggle('is-skills-complete', selectionsComplete)

  if (screen.classList.contains('is-specialization')) {
    turnPageButton.disabled = !selectionsComplete
  }

  skillOptions.forEach((option) => {
    option.disabled = !option.checked && selectedCount >= skillSelectionLimit
  })
}

skillOptions.forEach((option) => {
  option.addEventListener('change', updateSkillSelections)
})

turnPageButton.addEventListener('click', handleClick(turnExamPage))

turnPageButton.disabled = true
