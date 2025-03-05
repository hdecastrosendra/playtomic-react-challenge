import { ReactNode, useMemo, useState } from 'react'
import { Auth, AuthInitializeConfig, TokensData, UserData } from './types'
import { AuthContext } from './AuthContext'

interface AuthProviderProps extends AuthInitializeConfig {
  children?: ReactNode
  initialTokens?: AuthInitializeConfig['initialTokens']
  onAuthChange?: AuthInitializeConfig['onAuthChange']
}

function AuthProvider(props: AuthProviderProps): JSX.Element {
  const { initialTokens, onAuthChange, children } = props
  const [tokens, setTokens] = useState<TokensData | null | undefined>(undefined)
  const [currentUser, setCurrentUser] = useState<UserData | null | undefined>(undefined)

  // Create a placeholder auth context value
  const authContextValue = useMemo<Auth>(
    () => ({
      currentUser,
      tokens,
      login: async () => {
        throw new Error('Not implemented')
      },
      logout: async () => {
        throw new Error('Not implemented')
      },
    }),
    [currentUser, tokens]
  )

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
}

export { AuthProvider }
