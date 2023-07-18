'use client'

import React from 'react'
import {
    onAuthStateChanged,
    getAuth,
} from 'firebase/auth'
import { auth } from '@/firebase/config'
import getUserData from '@/firebase/functions/getUserData'

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
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    )
}