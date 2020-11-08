/**
 * consts
 */
// local storage key
const lsKey = 'fm/rps'

// hands data
const hands = {
  rock: {
    image: '../img/icon-rock.svg',
    value: 'rock',
    beats: 'scissors',
  },
  paper: {
    image: '../img/icon-paper.svg',
    value: 'paper',
    beats: 'rock',
  },
  scissors: {
    image: '../img/icon-scissors.svg',
    value: 'scissors',
    beats: 'paper',
  },
}

// section 1 elements for click events
const handRock = document.querySelector('.section--1 .hand--rock')
const handPaper = document.querySelector('.section--1 .hand--paper')
const handScissors = document.querySelector('.section--1 .hand--scissors')

// section 2 elements to show selected hands
const playerPick = document.querySelector('.section--2 .picked--player .hand')
const playerPickImage = playerPick.querySelector('.hand__image')
const housePick = document.querySelector('.section--2 .picked--house .hand')
const housePickImage = housePick.querySelector('.hand__image')

// sections elements to hide or show
const section1 = document.querySelector('.section--1')
const section2 = document.querySelector('.section--2')

// result elements
const resultWrapper = document.querySelector('.result')
const result = document.querySelector('.result__title')
const scoreNumber = document.querySelector('.score__number')
const playAgain = document.querySelector('.result__play-again')

// modal elements
const rulesModal = document.querySelector('.rules-modal')
const openRules = document.querySelector('.open-rules')
const closeRules = document.querySelector('.rules__close')

/**
 * state
 */
let totalScore, playerHand, houseHand

/**
 * functions
 */
const getRandomHand = () => {
  const handKeys = Object.keys(hands)
  const randomIndex = Math.floor(Math.random() * handKeys.length)
  const randomKey = handKeys[randomIndex]

  return hands[randomKey]
}

const toggleSections = () => {
  const sections = [section1, section2]

  sections.forEach((section) => section.classList.toggle('section--active'))
}

const toggleFinalResult = () => {
  resultWrapper.classList.toggle('result--active')
}

const toggleRulesModal = () => {
  rulesModal.classList.toggle('rules-modal--active')
}

const getResult = () => {
  if (playerHand.beats === houseHand.value) {
    totalScore = totalScore + 1
    localStorage.setItem(lsKey, totalScore)
    return { winner: 'player', resultText: 'You win' }
  }

  if (playerHand.value === houseHand.beats) {
    totalScore = totalScore > 0 ? totalScore - 1 : 0
    localStorage.setItem(lsKey, totalScore)
    return { winner: 'house', resultText: 'You lose' }
  }

  return { winner: null, resultText: 'Draw' }
}

// resets everything
const goToStep1 = () => {
  toggleFinalResult()
  toggleSections()
}

// shows player's move
// hides house's move
const goToStep2 = (e) => {
  const playerPickKey = e.currentTarget.dataset.hand

  playerHand = hands[playerPickKey]
  houseHand = getRandomHand()

  playerPick.className = `hand hand--result hand--${playerHand.value}`
  playerPickImage.src = playerHand.image

  housePick.className = 'hand hand--result hand--empty'
  housePickImage.src = ''

  toggleSections()
  goToStep3()
}

// shows houses's move
const goToStep3 = () => {
  setTimeout(() => {
    housePick.className = `hand hand--result hand--${houseHand.value}`
    housePickImage.src = houseHand.image

    goToStep4()
  }, 1000)
}

// shows final result
const goToStep4 = () => {
  const { winner, resultText } = getResult()

  setTimeout(() => {
    winner === 'player' && playerPick.classList.add('hand--winner')
    winner === 'house' && housePick.classList.add('hand--winner')

    result.textContent = resultText
    scoreNumber.textContent = totalScore

    toggleFinalResult()
  }, 1000)
}

// add event listeners to the hands
// check if there is a score stored in the local storage
const init = () => {
  const handElements = [handRock, handPaper, handScissors]
  handElements.forEach((hand) => hand.addEventListener('click', goToStep2))

  totalScore = Number(localStorage.getItem(lsKey)) || 0
  scoreNumber.textContent = totalScore
}

/**
 * events
 */
window.addEventListener('load', init)
playAgain.addEventListener('click', goToStep1)
openRules.addEventListener('click', toggleRulesModal)
closeRules.addEventListener('click', toggleRulesModal)
