'use client'

import React from 'react'
import {
    onAuthStateChanged,
    getAuth,
} from 'firebase/auth'
import { auth } from '@/firebase/config'
import getUserData from '@/firebase/functions/getUserData'
import Image from 'next/image'

// const auth = getAuth(app)

export const AuthContext = React.createContext({})

export const useAuthContext = () => React.useContext(AuthContext)

export const AuthContextProvider = ({
    children,
}) => {
    const [user, setUser] = React.useState(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const res = await getUserData(user.uid)
                setUser(res)
                console.log(res['result'])
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ user }}>
            {loading ? 
                <div className="flex align-middle justify-center">
                    <Image src="fingerprint-blue.svg" alt="Loading" height="300" width="300" className="w-screen h-screen" />
                </div> : children}
        </AuthContext.Provider>
    )
}