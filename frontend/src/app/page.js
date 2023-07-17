import Link from 'next/link'

export default function Home() {
  return (
    <div className="splash-container">
    <h1 className="splash-title">Battleship</h1>
    <div>
      <Link href="/singleplayer" className="btn splash-btn">Singleplayer</Link>
      <Link href="/multiplayer" className="btn splash-btn">Multiplayer</Link>
    </div>
  </div>
  )
}
