'use client'

import { useEffect } from "react"
import { io } from "socket.io-client"

export default function sad() {
  useEffect(() => {
    const socket = io("http://localhost:3000")
  }, [])
  return(
    <>
      sock
    </>
  )
}