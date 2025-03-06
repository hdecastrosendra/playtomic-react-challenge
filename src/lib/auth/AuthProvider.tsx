import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Auth, AuthInitializeConfig, TokensData, UserData } from './types'
import { AuthContext } from './AuthContext'
import { useApiFetcher } from '@/lib/api'

const REFRESH_THRESHOLD_MS = 5 * 60 * 1000

interface AuthProviderProps extends AuthInitializeConfig {
  children?: ReactNode
  initialTokens?: AuthInitializeConfig['initialTokens']
  onAuthChange?: AuthInitializeConfig['onAuthChange']
}

function AuthProvider(props: AuthProviderProps): JSX.Element {
  const { initialTokens, onAuthChange, children } = props
  const fetcher = useApiFetcher()
  const refreshTimerRef = useRef<number | NodeJS.Timeout | null>(null)
  const [tokens, setTokens] = useState<TokensData | null | undefined>(undefined)
  const [currentUser, setCurrentUser] = useState<UserData | null | undefined>(undefined)

  const clearAuthState = useCallback(() => {
    setTokens(null)
    setCurrentUser(null)
  }, [])

  const refreshToken = useCallback(async () => {
    if (!tokens?.refresh) {
      return false
    }

    try {
      const refreshResponse = await fetcher('POST /v3/auth/refresh', {
        data: {
          refreshToken: tokens.refresh,
        },
      })

      if (!refreshResponse.ok) {
        console.error('Failed to refresh token:', refreshResponse.data.message)
        clearAuthState()
        if (onAuthChange) {
          onAuthChange(null)
        }
        return false
      }

      const newTokens: TokensData = {
        access: refreshResponse.data.accessToken,
        accessExpiresAt: refreshResponse.data.accessTokenExpiresAt,
        refresh: refreshResponse.data.refreshToken,
        refreshExpiresAt: refreshResponse.data.refreshTokenExpiresAt,
      }

      setTokens(newTokens)

      if (onAuthChange) {
        onAuthChange(newTokens)
      }

      return true
    } catch (error) {
      console.error('Error refreshing token:', error)
      clearAuthState()
      if (onAuthChange) {
        onAuthChange(null)
      }
      return false
    }
  }, [tokens, fetcher, onAuthChange, clearAuthState])

  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }

    if (!tokens?.accessExpiresAt) {
      return
    }

    const expiresAt = new Date(tokens.accessExpiresAt).getTime()
    const now = Date.now()
    const timeUntilExpiry = expiresAt - now

    // Only schedule refresh if expiry is within a reasonable timeframe
    // This prevents issues with test tokens that might have very far future expiry dates
    const MAX_TIMEOUT = 2147483647 // Max safe timeout value (~24.8 days)

    if (timeUntilExpiry <= 0) {
      refreshToken().catch(error => {
        console.error('Error refreshing token:', error)
      })
    } else if (timeUntilExpiry < MAX_TIMEOUT) {
      const refreshTime = Math.max(0, timeUntilExpiry - REFRESH_THRESHOLD_MS)

      refreshTimerRef.current = setTimeout(() => {
        refreshToken().catch(error => {
          console.error('Error refreshing token:', error)
        })
      }, refreshTime)
    }
  }, [tokens, refreshToken])

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current !== null) {
        window.clearTimeout(refreshTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (tokens) {
      scheduleTokenRefresh()
    }
  }, [tokens, scheduleTokenRefresh])

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

  const loadInitialTokens = useCallback(async () => {
    try {
      if (!initialTokens) {
        clearAuthState()
        return
      }

      const resolvedTokens = await Promise.resolve(initialTokens)

      if (!resolvedTokens) {
        clearAuthState()
        return
      }

      setTokens(resolvedTokens)

      const userData = await loadUserInfo(resolvedTokens.access)

      if (!userData) {
        clearAuthState()
        return
      }

      setCurrentUser(userData)
    } catch (error) {
      console.error('Error loading initial tokens:', error)
      clearAuthState()
    }
  }, [initialTokens, loadUserInfo, clearAuthState])

  useEffect(() => {
    loadInitialTokens().catch(error => {
      console.error('Error in loadInitialTokens:', error)
    })
  }, [loadInitialTokens])

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
