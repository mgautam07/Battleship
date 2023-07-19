import './globals.css'
import './styles.css'
import { Inter } from 'next/font/google'
import { AuthContextProvider } from '@/context/AuthContext'
import Navbar from "./components/Navbar"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Battleship game',
  description: 'Battleship game built using Nexjs 13 and socket.io',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <Navbar />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  )
}
