'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {

  const [roomId, setRoomId] = useState("")

  useEffect(() => {
    setRoomId(() => {
      const hex = "123456789abcdef"
      let letters = []
      for (let i = 0; i < 6; i++) {
        letters.push(hex[Math.floor(Math.random() * hex.length)])
      }
      return letters.join('')
    })
  }, [])

  return (
    <div className="splash-container">
    <h1 className="splash-title">Battleship</h1>
    <div>
      {roomId}
      <Link href="/singleplayer" className="btn splash-btn">Singleplayer</Link>
      {console.log(roomId)}
      <Link href={`/multiplayer?room=${roomId}`} className="btn splash-btn">Multiplayer</Link>
    </div>
  </div>
  )
}
