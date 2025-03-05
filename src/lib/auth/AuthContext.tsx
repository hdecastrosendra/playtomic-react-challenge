import { createContext } from 'react'
import { Auth } from './types'

/**
 * Context that provides authentication state to the entire application.
 * Used by the useAuth hook to access authentication state from any component.
 */
export const AuthContext = createContext<Auth | null>(null)
