import { ReactNode, useCallback, useMemo, useState } from 'react'
import { Auth, AuthInitializeConfig, TokensData, UserData } from './types'
import { AuthContext } from './AuthContext'
import { useApiFetcher } from '@/lib/api'

interface AuthProviderProps extends AuthInitializeConfig {
  children?: ReactNode
  initialTokens?: AuthInitializeConfig['initialTokens']
  onAuthChange?: AuthInitializeConfig['onAuthChange']
}

function AuthProvider(props: AuthProviderProps): JSX.Element {
  const { initialTokens, onAuthChange, children } = props
  const fetcher = useApiFetcher()
  const [tokens, setTokens] = useState<TokensData | null | undefined>(undefined)
  const [currentUser, setCurrentUser] = useState<UserData | null | undefined>(undefined)

  const clearAuthState = useCallback(() => {
    setTokens(null)
    setCurrentUser(null)
  }, [])

  const loadUserInfo = useCallback(
    async (accessToken: string): Promise<UserData | null> => {
      try {
        const userResponse = await fetcher(
          'GET /v1/users/me',
          {},
          {
            headers: new Headers({
              authorization: `Bearer ${accessToken}`,
            }),
          }
        )

        if (!userResponse.ok) {
          return null
        }

        return {
          userId: userResponse.data.userId,
          name: userResponse.data.displayName,
          email: userResponse.data.email ?? '',
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
        return null
      }
    },
    [fetcher]
  )

  const login = useCallback(
    async (credentials: { email: string; password: string }): Promise<void> => {
      try {
        if (currentUser !== null) {
          throw new Error('User is already logged in')
        }

        const loginResponse = await fetcher('POST /v3/auth/login', {
          data: credentials,
        })

        if (!loginResponse.ok) {
          throw new Error(loginResponse.data.message)
        }

        const newTokens: TokensData = {
          access: loginResponse.data.accessToken,
          accessExpiresAt: loginResponse.data.accessTokenExpiresAt,
          refresh: loginResponse.data.refreshToken,
          refreshExpiresAt: loginResponse.data.refreshTokenExpiresAt,
        }

        const userData = await loadUserInfo(newTokens.access)

        if (!userData) {
          throw new Error('Error fetching user info')
        }

        setTokens(newTokens)
        setCurrentUser(userData)

        if (onAuthChange) {
          onAuthChange(newTokens)
        }
      } catch (error) {
        clearAuthState()

        throw error
      }
    },
    [fetcher, currentUser, loadUserInfo, clearAuthState, onAuthChange]
  )

  const logout = useCallback(async (): Promise<void> => {
    try {
      if (currentUser === null) {
        throw new Error('No user is logged in')
      }

      clearAuthState()

      if (onAuthChange) {
        onAuthChange(null)
      }

      await Promise.resolve()
    } catch (error) {
      console.error('Error during logout:', error)
      throw error
    }
  }, [currentUser, onAuthChange, clearAuthState])

  // Create a placeholder auth context value
  const authContextValue = useMemo<Auth>(
    () => ({
      currentUser,
      tokens,
      login,
      logout,
    }),
    [currentUser, tokens, login, logout]
  )

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
}

export { AuthProvider }
