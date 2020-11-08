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

// step 1 elements for click events
const handRock = document.querySelector('.step--1 .hand--rock')
const handPaper = document.querySelector('.step--1 .hand--paper')
const handScissors = document.querySelector('.step--1 .hand--scissors')

// step 2 elements to show selected hands
const pickedHandPlayer = document.querySelector('.step--2 .picked--you .hand')
const pickedHandHouse = document.querySelector('.step--2 .picked--house .hand')

// steps elements to hide or show
const step1 = document.querySelector('.step--1')
const step2 = document.querySelector('.step--2')

// result elements
const resultWrapper = document.querySelector('.result')
const result = document.querySelector('.result__title')
const scoreNumber = document.querySelector('.score__number')
const playAgain = document.querySelector('.result__play-again')

/**
 * state
 */
let totalScore

/**
 * functions
 */
const getRandomHand = () => {
  const handKeys = ['rock', 'paper', 'scissors']
  const randomIndex = Math.floor(Math.random() * handKeys.length)
  const randomKey = handKeys[randomIndex]

  return hands[randomKey]
}

const toggleSections = () => {
  const sections = [step1, step2]

  sections.forEach((section) => section.classList.toggle('step--active'))
}

const getResult = (playerHand, houseHand) => {
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

const goToStep1 = () => {
  toggleSections()
  resultWrapper.classList.toggle('result--active')
}

const goToStep2 = (e) => {
  const playerHandKey = e.currentTarget.dataset.hand
  const playerHand = hands[playerHandKey]
  const houseHand = getRandomHand()
  const { winner, resultText } = getResult(playerHand, houseHand)

  toggleSections()

  pickedHandPlayer.className = `hand hand--${playerHand.value}`
  pickedHandHouse.className = 'hand hand--empty'

  pickedHandPlayer.querySelector('.hand__image').src = playerHand.image
  pickedHandHouse.querySelector('.hand__image').src = ''

  result.textContent = ''

  setTimeout(() => {
    pickedHandHouse.className = `hand hand--${houseHand.value}`
    pickedHandHouse.querySelector('.hand__image').src = houseHand.image

    setTimeout(() => {
      pickedHandPlayer.className = `hand hand--${playerHand.value} ${
        winner === 'player' ? 'hand--winner' : ''
      }`
      pickedHandHouse.className = `hand hand--${houseHand.value} ${
        winner === 'house' ? 'hand--winner' : ''
      }`

      result.textContent = resultText
      scoreNumber.textContent = totalScore
      resultWrapper.classList.toggle('result--active')
    }, 2000)
  }, 2000)
}

/**
 * events
 */
window.addEventListener('load', () => {
  const handElements = [handRock, handPaper, handScissors]
  handElements.forEach((hand) => hand.addEventListener('click', goToStep2))

  totalScore = Number(localStorage.getItem(lsKey)) || 0
  scoreNumber.textContent = totalScore
})

playAgain.addEventListener('click', goToStep1)
