'use client'

import { useEffect } from "react"

export default function Singleplayer() {
  // let computerSquares = []
  // let userSquares = []
  let currentPlayer = 'user'
  let playerNum = 0
  let ready = 0
  let enemyReady = false
  let shotFired = -1
  let playerTurn
  const width = 10
  let isGameOver = false
  let playerHits = []
  let computerHits = []
  let playerSunkShips = []
  let computerSunkShips = []

  useEffect(() => {
    const gamesBoardContainer = document.querySelector('#gamesboard-container')
    const optionContainer = document.querySelector('.option-container')
    const flipButton = document.querySelector('#flip-button')
    const startButton = document.querySelector('#start-button')
    const turnDisplay = document.querySelector('#turn-display')
    const infoDisplay = document.querySelector('#info')

    const handleClick = (e) => {
      if(!isGameOver){
        if(e.target.classList.contains('taken')){
          e.target.classList.add('boom')
          infoDisplay.textContent = 'You hit computers ship'
          let classes = Array.from(e.target.classList)
          classes = classes.filter(className => className !== 'block')
          classes = classes.filter(className => className !== 'boom')
          classes = classes.filter(className => className !== 'taken')
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
        setTimeout(enemyGo, 1000)
      }
    }

  //   flipButton.addEventListener('click', flip)

    const createBoard = (user) => {
      const gameBoardContainer = document.createElement('div')
      gameBoardContainer.classList.add('game-board')
      gameBoardContainer.id = user

      for (let i = 0; i < width * width; i++) {
        const block = document.createElement('div')
        block.classList.add('block')
        block.id = i
        gameBoardContainer.append(block)
      }

      gamesBoardContainer.append(gameBoardContainer)
    }
    createBoard('player')
    createBoard( 'computer')
    // Creating Ships
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
    const addShipPiece = (ship)=> {
      const allBoardBlocks = document.querySelectorAll('#computer div')
      let isHorizontal = Math.random() < 0.5
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
        shipBlocks.forEach((shipBlock, index) => {
          shipBlock.classList.add(ship.name)
          shipBlock.classList.add('taken')
        })
      }
      else{
        addShipPiece(ship)
      }
    }
    const startGameSingle = () => {
      if (playerTurn === undefined) {
        const allBoardBlocks = document.querySelectorAll('#computer div')
        allBoardBlocks.forEach(block => block.addEventListener('click', handleClick))
        playerTurn = true
        turnDisplay.textContent = 'Your turn'
        infoDisplay.textContent = 'The game has started'
      }
    }

  const startSinglePlayer = () => {
    // createBoard('yellow', 'player')
    // createBoard('pink', 'computer')
    addShipPiece(destroyer)
    addShipPiece(submarine)
    addShipPiece(cruiser)
    addShipPiece(battleship)
    addShipPiece(carrier)

    startButton.addEventListener('click', startGameSingle)

  }
  startSinglePlayer()
  const addPlayerShipPiece = (ship)=> {
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
      playerShipBlocks.forEach((shipBlock, index) => {
        if(shipBlock.classList.contains("vertical")) shipBlock.classList.remove("vertical")
        if(shipBlock.classList.contains("horizontal")) shipBlock.classList.remove("horizontal")
        if(shipBlock.classList.contains("start")) shipBlock.classList.remove("start")
        if(shipBlock.classList.contains("end")) shipBlock.classList.remove("end")
        if(shipBlock.classList.contains("undefined")) shipBlock.classList.remove("undefined")
        let directionClass = "undefined"
        if(index === 0) directionClass = "start"
        if(index === ship.length-1) directionClass = 'end'
        shipBlock.classList.add(directionClass)
        shipBlock.classList.add(ship.name)
        shipBlock.classList.add('taken')
        if(isHorizontal)  shipBlock.classList.add('horizontal')
        else  shipBlock.classList.add('vertical')
      })
    }
    else{
      addPlayerShipPiece(ship)
    }
  }  
  
  const flip = ()=> {
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

  flipButton.addEventListener('click', flip)


  addPlayerShipPiece(destroyer)
  addPlayerShipPiece(submarine)
  addPlayerShipPiece(cruiser)
  addPlayerShipPiece(battleship)
  addPlayerShipPiece(carrier)

  
  const enemyGo = (square) => {
    if(!isGameOver){
      turnDisplay.textContent = 'Enemy turn'
      infoDisplay.textContent = 'Enemy thinking'

      setTimeout(() =>{
        square = Math.floor(Math.random() * width * width)
        const allBoardBlocks = document.querySelectorAll('#player div')
        if(allBoardBlocks[square].classList.contains('taken') && 
            allBoardBlocks[square].classList.contains('boom')){
            enemyGo(square)
            return
        }
        else if(allBoardBlocks[square].classList.contains('taken') && 
                !allBoardBlocks[square].classList.contains('boom')){
          allBoardBlocks[square].classList.add('boom')
          infoDisplay.textContent = 'Enemy hit your ship'
          let classes = Array.from(allBoardBlocks[square].classList)
          classes = classes.filter(className => className !== 'block')
          classes = classes.filter(className => className !== 'boom')
          classes = classes.filter(className => className !== 'taken')
          computerHits.push(...classes)
          checkScore('computer', computerHits, computerSunkShips)
        }
        else {
          infoDisplay.textContent = 'Enemy missed'
          allBoardBlocks[square].classList.add('empty')
        }
      }, 100)

      setTimeout(() => {  playerTurn = true
        turnDisplay.textContent = 'Your turn'
        infoDisplay.textContent = 'Take your go'
        const allBoardBlocks = document.querySelectorAll('#computer div')
        allBoardBlocks.forEach(block => block.addEventListener('click', handleClick))
      }, 100)
    }
  }

  const checkScore = (user, userHits, userSunkShips) => {
    const checkShip = (shipName, shipLength) => {
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
      isGameOver = true
    }
    else if(computerSunkShips.length === 5){
      infoDisplay.textContent = 'Computer sunk all your ships'
      isGameOver = true
    }
  }
  
}, [])


  return(
    <>
      <div id="gamesboard-container"></div>

      <div className="container hidden-info">
        <div className="setup-buttons">
          <button id="flip-button" className="btn">RANDOMIZE</button>
          <button id="start-button" className="btn">START</button>
        </div>
        <div id="game-info">
          <p className="info-text">Turn : <span id="turn-display"></span></p>
          <p className="info-text">Info : <span id="info"></span></p>
        </div>
      </div>
    </>
    
  )
}

