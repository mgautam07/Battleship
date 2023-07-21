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
        <input
            className="flex h-12 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 mb-6 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Room code"
            onChange={(e) => setRoomId(e.target.value)}
        ></input>
      </div>
      <div className='mb-16 h-4 text-2xl'>
        Room code - {roomId}
      </div>
      <div>
        <Link href="/singleplayer" className="btn splash-btn">Singleplayer</Link>
        <Link href={`/multiplayer?room=${roomId}`} className="btn splash-btn">Multiplayer</Link>
      </div>
    </div>
  )
}
