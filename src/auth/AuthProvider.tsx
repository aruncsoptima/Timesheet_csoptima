import React, { createContext, useContext } from 'react'

// Simple stubbed AuthProvider used when Cognito is disabled. It provides
// a minimal context so components importing `useAuth` don't break.
const AuthContext = createContext({ user: null as any, signIn: async () => { }, signOut: async () => { } })
export const useAuth = () => useContext(AuthContext)
export function AuthProvider({ children }: { children: React.ReactNode }) {
    return <AuthContext.Provider value={{ user: null, signIn: async () => { }, signOut: async () => { } }}>{children}</AuthContext.Provider>
}
