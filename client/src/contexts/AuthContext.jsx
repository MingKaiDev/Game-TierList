import { createContext, useEffect, useState } from 'react'
import { subscribeAuth } from '../firebaseAuth'

export const AuthCtx = createContext(null)

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setUser(u)
      setReady(true)
    })
    return unsub
  }, [])

  return (
    <AuthCtx.Provider value={{ user, ready }}>
      {children}
    </AuthCtx.Provider>
  )
}
