document.addEventListener('DOMContentLoaded', () => {  
  const gamesBoardContainer = document.querySelector('#gamesboard-container')
  const optionContainer = document.querySelector('.option-container')
  const flipButton = document.querySelector('#flip-button')
  const startButton = document.querySelector('#start-button')
  const turnDisplay = document.querySelector('#turn-display')
  const infoDisplay = document.querySelector('#info')
  let computerSquares = []
  let userSquares = []
  let currentPlayer = 'user'
  let playerNum = 0
  let ready = 0
  let enemyReady = false
  let shotFired = -1
  let playerTurn
  const width = 10
  let isGameOver = false
  createBoard('yellow', 'player')
  createBoard('pink', 'computer')
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
  if(gameMode === 'singlePlayer') startSinglePlayer()
  if(gameMode === 'multiplayer') startMultiPlayer()
  // singlePlayerButton.addEventListener('click', startSinglePlayer)
  // multiPlayerButton.addEventListener('click', startMultiPlayer)

  function startMultiPlayer(){
    const blocks = document.querySelectorAll('#computer div')
    console.log()
    for(let i=0; i<100; i++)
    {
      blocks[i].addEventListener('click', () => {
        if(currentPlayer === 'user' && ready && enemyReady){
          shotFired = i
          socket.emit('fire', shotFired)
        }
      })
      computerSquares.push(blocks[i])
    }

    function revealSquare(classList) {
      const enemySquare = document.querySelectorAll('#computer div')[shotFired]
      const obj = Object.values(classList)
      console.log(enemySquare)
      if (!enemySquare.classList.contains('boom') && currentPlayer === 'user' && !isGameOver) {
        if (obj.includes('destroyer')) destroyerCount++
        if (obj.includes('submarine')) submarineCount++
        if (obj.includes('cruiser')) cruiserCount++
        if (obj.includes('battleship')) battleshipCount++
        if (obj.includes('carrier')) carrierCount++
      }
      if (obj.includes('taken')) {
        enemySquare.classList.add('boom')
      } else {
        enemySquare.classList.add('empty')
      }
      checkForWins()
      currentPlayer = 'enemy'
    }

    function enemyGo(square) {
      if (gameMode === 'singlePlayer') square = Math.floor(Math.random() * userSquares.length)
      if (!userSquares[square].classList.contains('boom')) {
        if(userSquares[square].classList.contains('taken'))
          userSquares[square].classList.add('boom')
        else
          userSquares[square].classList.add('empty')
        if (userSquares[square].classList.contains('destroyer')) cpuDestroyerCount++
        if (userSquares[square].classList.contains('submarine')) cpuSubmarineCount++
        if (userSquares[square].classList.contains('cruiser')) cpuCruiserCount++
        if (userSquares[square].classList.contains('battleship')) cpuBattleshipCount++
        if (userSquares[square].classList.contains('carrier')) cpuCarrierCount++
        checkForWins()
      } else if (gameMode === 'singlePlayer') enemyGo()
      currentPlayer = 'user'
      turnDisplay.innerHTML = 'Your Go'
    }

    function checkForWins() {
      let enemy = 'computer'
      if(gameMode === 'multiPlayer') enemy = 'enemy'
      if (destroyerCount === 2) {
        infoDisplay.innerHTML = `You sunk the ${enemy}'s destroyer`
        destroyerCount = 10
      }
      if (submarineCount === 3) {
        infoDisplay.innerHTML = `You sunk the ${enemy}'s submarine`
        submarineCount = 10
      }
      if (cruiserCount === 3) {
        infoDisplay.innerHTML = `You sunk the ${enemy}'s cruiser`
        cruiserCount = 10
      }
      if (battleshipCount === 4) {
        infoDisplay.innerHTML = `You sunk the ${enemy}'s battleship`
        battleshipCount = 10
      }
      if (carrierCount === 5) {
        infoDisplay.innerHTML = `You sunk the ${enemy}'s carrier`
        carrierCount = 10
      }
      if (cpuDestroyerCount === 2) {
        infoDisplay.innerHTML = `${enemy} sunk your destroyer`
        cpuDestroyerCount = 10
      }
      if (cpuSubmarineCount === 3) {
        infoDisplay.innerHTML = `${enemy} sunk your submarine`
        cpuSubmarineCount = 10
      }
      if (cpuCruiserCount === 3) {
        infoDisplay.innerHTML = `${enemy} sunk your cruiser`
        cpuCruiserCount = 10
      }
      if (cpuBattleshipCount === 4) {
        infoDisplay.innerHTML = `${enemy} sunk your battleship`
        cpuBattleshipCount = 10
      }
      if (cpuCarrierCount === 5) {
        infoDisplay.innerHTML = `${enemy} sunk your carrier`
        cpuCarrierCount = 10
      }

      if ((destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount) === 50) {
        infoDisplay.innerHTML = "YOU WIN"
        gameOver()
      }
      if ((cpuDestroyerCount + cpuSubmarineCount + cpuCruiserCount + cpuBattleshipCount + cpuCarrierCount) === 50) {
        infoDisplay.innerHTML = `${enemy.toUpperCase()} WINS`
        gameOver()
      }
    }

    function gameOver() {
      isGameOver = true
    }

    const temp = document.querySelectorAll('#player div')
    for(let i=0; i<100; i++)
    {
      userSquares.push(temp[i])
    }

    const socket = io()
    socket.on('player-number', num => {
      if(num === -1){
        infoDisplay.textContent = "Server full"
      }
      else{
        playerNum = parseInt(num)
        if(playerNum === 1) currentPlayer = "enemy"
        console.log(playerNum)
        socket.emit('check-players')
      }
    })

    socket.on('player-connection', num => {
      console.log(`Player number ${num} has disconnected or connected`)
      playerConnectedOrDisconnected(num)
    })

    socket.on('enemy-ready', num => {
      enemyReady = true
      playerReady(num)
      if(ready) startGameMulti(socket)
    })

    socket.on('check-players', players => {
      players.forEach((p, i) => {
        if(p.connected) playerConnectedOrDisconnected(i)
        if(p.ready){
          playerReady(i)
          if(i !== playerNum) enemyReady = true
        }
      })
    })

    // On fire receive
    socket.on('fire', id => {
      console.log('fire', id)
      enemyGo(id)
      const square = userSquares[id].classList
      console.log(square)
      socket.emit('fire-reply', square)
      startGameMulti(socket)
    })

    socket.on('fire-reply', square => {
      console.log(square)
      revealSquare(square)
      startGameMulti(socket)
    })
    
    socket.on('timeout', () => {
      infoDisplay.textContent = 'Reached 10 min limit'
    })

    startButton.addEventListener('click', () => {
      flipButton.replaceWith(flipButton.cloneNode(true))
      startGameMulti(socket)
    })

    function playerConnectedOrDisconnected(num) {
      let player = `.p${parseInt(num) + 1}`
      document.querySelector(`${player} .connected`).classList.toggle('active')
      if(parseInt(num) === playerNum)
        document.querySelector(player).style.fontWeight = 'bold'
    }
  }
  
  function startSinglePlayer() {
    // createBoard('yellow', 'player')
    // createBoard('pink', 'computer')
    addShipPiece(destroyer)
    addShipPiece(submarine)
    addShipPiece(cruiser)
    addShipPiece(battleship)
    addShipPiece(carrier)

    startButton.addEventListener('click', startGameSingle)

  }

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
  function createBoard(color, user){
    const gameBoardContainer = document.createElement('div')
    gameBoardContainer.classList.add('game-board')
    // gameBoardContainer.style.backgroundColor = color
    gameBoardContainer.id = user

    for (let i = 0; i < width * width; i++) {
      const block = document.createElement('div')
      block.classList.add('block')
      block.id = i
      gameBoardContainer.append(block)
    }

    gamesBoardContainer.append(gameBoardContainer)
  }

  flipButton.addEventListener('click', flip)

  function addShipPiece(ship){
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
      playerShipBlocks.forEach((shipBlock, index) => {
        let directionClass = "undefined"
        if(index === 0) directionClass = "start"
        if(index === ship.length-1) directionClass = 'end'
        shipBlock.classList.add(directionClass)
        shipBlock.classList.add(ship.name)
        shipBlock.classList.add('taken')
        console.log(directionClass)
        if(isHorizontal)  shipBlock.classList.add('horizontal')
        else  shipBlock.classList.add('vertical')
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

  //Game logic for multi player
  function startGameMulti(socket) {
    // console.log(isGameOver)
    if(isGameOver) return
    if(!ready){
      console.log('ready')
      socket.emit('player-ready')
      ready = true
      playerReady(playerNum)
    }
    if(enemyReady)
    {
      if(currentPlayer === 'user'){
        turnDisplay.textContent = 'Your turn'
      }
      else if(currentPlayer === 'enemy'){
        turnDisplay.textContent = "Enemy's turn"
      }
    }
  }

  function playerReady(num) {
    let player = `.p${parseInt(num)+1}`
    document.querySelector(`${player} .ready`).classList.toggle('active')
  }
  
  function handleClick(e) {
    if(!isGameOver){
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
      setTimeout(enemyGo, 1000)
    }
  }

  // Game logic for single player
  function startGameSingle() {
    if (playerTurn === undefined) {
      const allBoardBlocks = document.querySelectorAll('#computer div')
      console.log(allBoardBlocks)
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

  

  let cpuDestroyerCount = 0
  let cpuSubmarineCount = 0
  let cpuCruiserCount = 0
  let cpuBattleshipCount = 0
  let cpuCarrierCount = 0
  let destroyerCount = 0
  let submarineCount = 0
  let cruiserCount = 0
  let battleshipCount = 0
  let carrierCount = 0

  function enemyGo(square) {
    if(!isGameOver){
      turnDisplay.textContent = 'Enemy turn'
      infoDisplay.textContent = 'Enemy thinking'

      setTimeout(() =>{
        if(gameMode === 'singlePlayer') square = Math.floor(Math.random() * width * width)
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
      isGameOver = true
    }
    else if(computerSunkShips.length === 5){
      infoDisplay.textContent = 'Computer sunk all your ships'
      isGameOver = true
    }
  }
})