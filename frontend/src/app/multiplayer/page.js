'use client'

import { useEffect, useState, useContext } from "react"
import { io } from 'socket.io-client'
import { useSearchParams, useRouter } from 'next/navigation'
import updateWin from "@/firebase/functions/updateWin"
import updateLose from "@/firebase/functions/updateLose"
import { AuthContext } from "@/context/AuthContext"


export default function Multiplayer() {
  const [room, setRoom] = useState()
  const {user, setUser} = useContext(AuthContext)
  const router = useRouter()
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

  const searchParams = useSearchParams().get('room')
  
  // console.log(searchParams)
  // setRoom(searchParams)
  
  
  useEffect(async () => {
    // updateWin(user['result'].id, user['result'].wins)
    // updateLose(user['result'].id, user['result'].loses)
    const socket = io(`https://battleship-fnn4.onrender.com?room=${searchParams}`)
    const gamesBoardContainer = document.querySelector('#gamesboard-container')
    const optionContainer = document.querySelector('.option-container')
    const flipButton = document.querySelector('#flip-button')
    const startButton = document.querySelector('#start-button')
    const turnDisplay = document.querySelector('#turn-display')
    const infoDisplay = document.querySelector('#info')

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
    createBoard('computer')
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

    const playerReady = (num) => {
      let player = `.p${(parseInt(num)%2)+1}`
      document.querySelector(`${player} .ready`).classList.toggle('active')
    }

    //Game logic for multi player
    const startGameMulti = (socket) => {
      if(isGameOver) return
      if(!ready){
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

    function startMultiPlayer() {
      const blocks = document.querySelectorAll('#computer div')
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
        }
        currentPlayer = 'user'
        turnDisplay.innerHTML = 'Your Go'
      }
  
      async function checkForWins() {
        let enemy = 'enemy'
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
          if(user)  updateWin(user['result'].id, user['result'].wins)
          gameOver()
        }
        if ((cpuDestroyerCount + cpuSubmarineCount + cpuCruiserCount + cpuBattleshipCount + cpuCarrierCount) === 50) {
          infoDisplay.innerHTML = `${enemy.toUpperCase()} WINS`
          if(user)  updateLose(user['result'].id, user['result'].loses)
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
  
      socket.on('player-number', num => {
        if(num === -1){
          infoDisplay.textContent = "Server full"
          router.replace('/')
        }
        else{
          playerNum = parseInt(num)
          if(playerNum === 1) currentPlayer = "enemy"
          socket.emit('check-players')
        }
      })
  
      socket.on('player-connection', num => {
        // console.log(`Player number ${num} has disconnected or connected`)
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
        enemyGo(id)
        const square = userSquares[id].classList
        socket.emit('fire-reply', square)
        startGameMulti(socket)
      })
  
      socket.on('fire-reply', square => {
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
        let player = `.p${(parseInt(num)%2) +1}`
        // console.log(player)
        // console.log(document.querySelector(`${player} .connected`))
        document.querySelector(`${player} .connected`).classList.toggle('active')
        if(parseInt(num) === playerNum)
          document.querySelector(player).style.fontWeight = 'bold'
      }
    }

    startMultiPlayer()
  }, [])


  return (
    <>
      <div className="container">
        <div className="player p1">
          Player 1
          <div className="connected">Connected</div>
          <div className="ready">Ready</div>
        </div>
        <div className="player p2">
          Player 2
          <div className="connected">Connected</div>
          <div className="ready">Ready</div>
        </div>
      </div>

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
