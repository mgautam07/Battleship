import React from 'react'
import Link from 'next/link'
import { Users2, Bot, Trophy } from 'lucide-react'

export default function Home() {
  return (
  <>
    <section className='m-16 mt-24 box-border pb-16'>
      <div className="px-2 lg:flex lg:flex-row lg:items-center">
        <div className="w-full lg:w-1/2">
          <div className="my-16 lg:my-0 lg:px-10">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Battleship
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-gray-600 text-2xl">
              Enjoy a classic board game on the web. Play in singleplayer versus the computer or invite your friends to play multiplayer in custom rooms.
            </p>
            <form action="#" method="POST" className="mt-8 max-w-xl">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Link href="/play">
                    <button
                      type="button"
                      className="rounded-md bg-[#ff8000] w-32 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      Play
                    </button>
                  </Link>
                  
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <img
            src="/ship.jpg"
            alt="ManWith Laptop"
            className="h-3/4 w-5/6 rounded-md object-cover"
          />
        </div>
      </div>
    </section>
    <div className='mt-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-xl text-center'>
        <h2 className="my-12 text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
          About Battleship
        </h2>
        
      </div>
      <p className='text-center text-2xl'>
        Battleship also known as Battleships is a strategy type guessing game for two players. It is played on ruled grids (paper or board) on which each player's fleet of warships are marked. The locations of the fleets are concealed from the other player. Players alternate turns calling "shots" at the other player's ships, and the objective of the game is to destroy the opposing player's fleet.
      </p>
    </div>
    <div className="">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="mt-32 my-12 text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
          Features
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
          consequat duis enim velit mollit.
        </p>
      </div>
      <div className="mt-12 flex justify-center align-middle mx-auto w-5/6 flex-wrap text-center ">
        <div className='w-96 m-16'>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <Users2 className="h-9 w-9 text-gray-700" />
          </div>
          <h3 className="mt-8 text-lg font-semibold text-black">1 VS 1</h3>
          <p className="mt-4 text-sm text-gray-600">
            Create custom rooms to play against others
          </p>
        </div>
        <div className='w-96 m-16'>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <Bot className="h-9 w-9 text-gray-700" />
          </div>
          <h3 className="mt-8 text-lg font-semibold text-black">1 VS Computer</h3>
          <p className="mt-4 text-sm text-gray-600">
            Play against computer
          </p>
        </div>
        <div className='w-96 m-16'>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <Trophy className="h-9 w-9 text-gray-700" />
          </div>
          <h3 className="mt-8 text-lg font-semibold text-black">Leaderboard</h3>
          <p className="mt-4 text-sm text-gray-600">
            Realtime updates on leaderboard
          </p>
        </div>
      </div>
    </div>
  </>
  )
}
  