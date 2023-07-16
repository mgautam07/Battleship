const gamesBoardContainer = document.querySelector('#gamesboard-container')
const optionContainer = document.querySelector('.option-container')
const flipButton = document.querySelector('#flip-button')
const startButton = document.querySelector('#start-button')
const turnDisplay = document.querySelector('#turn-display')
const infoDisplay = document.querySelector('#info')

let angle = 0

function flip(){
  // const optionShips = Array.from(optionContainer.children)
  // angle = angle === 0 ? 90 : 0
  // optionShips.forEach(optionShip => optionShip.style.transform = `rotate(${angle}deg)`)
  if(playerTurn !== undefined)  return
  const blocks = document.querySelectorAll('#player div')
  for(let i=0; i<width*width; i++)
  {
    if(blocks[i].classList.contains('taken'))
    {
      blocks[i].classList.remove('taken')
      if(blocks[i].classList.contains('destroyer'))
      {
        blocks[i].classList.remove('destroyer')
      }
      else if(blocks[i].classList.contains('submarine'))
      {
        blocks[i].classList.remove('submarine')
      }
      else if(blocks[i].classList.contains('cruiser'))
      {
        blocks[i].classList.remove('cruiser')
      }
      else if(blocks[i].classList.contains('battleship'))
      {
        blocks[i].classList.remove('battleship')
      }
      else if(blocks[i].classList.contains('carrier'))
      {
        blocks[i].classList.remove('carrier')
      }
    }
  }
  addPlayerShipPiece(destroyer)
  addPlayerShipPiece(submarine)
  addPlayerShipPiece(cruiser)
  addPlayerShipPiece(battleship)
  addPlayerShipPiece(carrier)
}

// Creating Boards
const width = 10
function createBoard(color, user){
  const gameBoardContainer = document.createElement('div')
  gameBoardContainer.classList.add('game-board')
  gameBoardContainer.style.backgroundColor = color
  gameBoardContainer.id = user

  for (let i = 0; i < width * width; i++) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.id = i
    gameBoardContainer.append(block)
  }

  gamesBoardContainer.append(gameBoardContainer)
}

createBoard('yellow', 'player')
createBoard('pink', 'computer')

flipButton.addEventListener('click', flip)

//Creating Ships
class Ship{
  constructor(name, length){
    this.name = name
    this.length = length
  }
}

const destroyer = new Ship('destroyer', 2)
const submarine = new Ship('submarine', 3)
const cruiser = new Ship('cruiser', 3)
const battleship = new Ship('battleship', 4)
const carrier = new Ship('carrier', 5)

const ships = [destroyer, submarine, cruiser, battleship, carrier]

function addShipPiece(ship){
  const allBoardBlocks = document.querySelectorAll('#computer div')
  let isHorizontal = Math.random() < 0.5
  // let isHorizontal = true
  let randomStartIndex = Math.floor(Math.random() * width * width)
  let shipBlocks = []
  // to check if ship is placed outside
  let validStart = isHorizontal ? randomStartIndex <= width*width - ship.length ? randomStartIndex : width*width-ship.length : randomStartIndex <= width*width - width*ship.length ? randomStartIndex : randomStartIndex-ship.length*width+width
  for(let i=0; i<ship.length; i++)
  {
    if(isHorizontal){
      shipBlocks.push(allBoardBlocks[Number(validStart) + i])
    }
    else{
      shipBlocks.push(allBoardBlocks[Number(validStart) + i *width])
    }
  }

  let valid
  if(isHorizontal){
    shipBlocks.every((_shipBlock, index) => valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index+1)))
  }
  else{
    shipBlocks.every((_shipBlock, index) => valid = shipBlocks[0].id < 90 + (width*index+1))
  }

  const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'))
  if(valid && notTaken){
    shipBlocks.forEach(shipBlock => {
      shipBlock.classList.add(ship.name)
      shipBlock.classList.add('taken')
    })
  }
  else{
    addShipPiece(ship)
  }
}
addShipPiece(destroyer)
addShipPiece(submarine)
addShipPiece(cruiser)
addShipPiece(battleship)
addShipPiece(carrier)

function addPlayerShipPiece(ship){
  const allPlayerBoardBlocks = document.querySelectorAll('#player div')
  let isHorizontal = Math.random() < 0.5
  // let isHorizontal = true
  let randomStartIndex = Math.floor(Math.random() * width * width)
  let playerShipBlocks = []
  // to check if ship is placed outside
  let validStart = isHorizontal ? randomStartIndex <= width*width - ship.length ? randomStartIndex : width*width-ship.length : randomStartIndex <= width*width - width*ship.length ? randomStartIndex : randomStartIndex-ship.length*width+width
  for(let i=0; i<ship.length; i++)
  {
    if(isHorizontal){
      playerShipBlocks.push(allPlayerBoardBlocks[Number(validStart) + i])
    }
    else{
      playerShipBlocks.push(allPlayerBoardBlocks[Number(validStart) + i *width])
    }
  }

  let valid
  if(isHorizontal){
    playerShipBlocks.every((_shipBlock, index) => valid = playerShipBlocks[0].id % width !== width - (playerShipBlocks.length - (index+1)))
  }
  else{
    playerShipBlocks.every((_shipBlock, index) => valid = playerShipBlocks[0].id < 90 + (width*index+1))
  }

  const notTaken = playerShipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'))
  if(valid && notTaken){
    playerShipBlocks.forEach(shipBlock => {
      shipBlock.classList.add(ship.name)
      shipBlock.classList.add('taken')
    })
  }
  else{
    addPlayerShipPiece(ship)
  }
}
addPlayerShipPiece(destroyer)
addPlayerShipPiece(submarine)
addPlayerShipPiece(cruiser)
addPlayerShipPiece(battleship)
addPlayerShipPiece(carrier)

let gameOver = false
let playerTurn

startButton.addEventListener('click', startGame)

function startGame() {
  if (playerTurn === undefined) {
    const allBoardBlocks = document.querySelectorAll('#computer div')
    allBoardBlocks.forEach(block => block.addEventListener('click', handleClick))
    playerTurn = true
    turnDisplay.textContent = 'Your turn'
    infoDisplay.textContent = 'The game has started'
  }
  
}

let playerHits = []
let computerHits = []
let playerSunkShips = []
let computerSunkShips = []

function handleClick(e) {
  if(!gameOver){
    if(e.target.classList.contains('taken')){
      e.target.classList.add('boom')
      infoDisplay.textContent = 'You hit computers ship'
      let classes = Array.from(e.target.classList)
      classes = classes.filter(className => className !== 'block')
      classes = classes.filter(className => className !== 'boom')
      classes = classes.filter(className => className !== 'taken')
      console.log('first', classes)
      playerHits.push(...classes)
      checkScore('player', playerHits, playerSunkShips)
    }
    if(!e.target.classList.contains('taken')){
      infoDisplay.textContent = 'Nothing hit'
      e.target.classList.add('empty')
    }
    playerTurn = false
    const allBoardBlocks = document.querySelectorAll('#computer div')
    allBoardBlocks.forEach(block => block.replaceWith(block.cloneNode(true)))
    setTimeout(computerGo, 2000)
  }
}

function computerGo() {
  if(!gameOver){
    turnDisplay.textContent = 'Computers turn'
    infoDisplay.textContent = 'Computer thinking'

    setTimeout(() =>{
      let randomGo = Math.floor(Math.random() * width * width)
      const allBoardBlocks = document.querySelectorAll('#player div')
      if(allBoardBlocks[randomGo].classList.contains('taken') && 
          allBoardBlocks[randomGo].classList.contains('boom')){
          computerGo()
          return
      }
      else if(allBoardBlocks[randomGo].classList.contains('taken') && 
              !allBoardBlocks[randomGo].classList.contains('boom')){
        allBoardBlocks[randomGo].classList.add('boom')
        infoDisplay.textContent = 'Computer hit your ship'
        let classes = Array.from(allBoardBlocks[randomGo].classList)
        classes = classes.filter(className => className !== 'block')
        classes = classes.filter(className => className !== 'boom')
        classes = classes.filter(className => className !== 'taken')
        computerHits.push(...classes)
        checkScore('computer', computerHits, computerSunkShips)
      }
      else {
        infoDisplay.textContent = 'Computer missed'
        allBoardBlocks[randomGo].classList.add('empty')
      }
    }, 2000)

    setTimeout(() => {  playerTurn = true
      turnDisplay.textContent = 'Your turn'
      infoDisplay.textContent = 'Take your go'
      const allBoardBlocks = document.querySelectorAll('#computer div')
      allBoardBlocks.forEach(block => block.addEventListener('click', handleClick))
    }, 2000)
  }
}

function checkScore(user, userHits, userSunkShips) {
  function checkShip(shipName, shipLength) {
    if(userHits.filter(storedShipName => storedShipName === shipName).length === shipLength){
      if(user === 'player'){
        infoDisplay.textContent = `You sunk the computer's ${shipName}`
        playerHits = userHits.filter(storedShipName => storedShipName !== shipName)
      }
      else if(user === 'computer'){
        infoDisplay.textContent = `You sunk the player's ${shipName}`
        computerHits = userHits.filter(storedShipName => storedShipName !== shipName)
      }
      userSunkShips.push(shipName)
    }
  }
  checkShip('destroyer', 2)
  checkShip('submarine', 3)
  checkShip('cruiser', 3)
  checkShip('battleship', 4)
  checkShip('carrier', 5)
  // console.log('player', playerHits)
  // console.log('playerSS', playerSunkShips)
  if(playerSunkShips.length === 5){
    infoDisplay.textContent = 'You sunk all the computers ships'
    gameOver = true
  }
  else if(computerSunkShips.length === 5){
    infoDisplay.textContent = 'Computer sunk all your ships'
    gameOver = true
  }
}