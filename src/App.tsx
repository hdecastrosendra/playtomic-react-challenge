import localForage from 'localforage'
import React, { ComponentProps, ReactNode, useCallback, useMemo } from 'react'
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/lib/auth'
import { ApiConfigProvider } from '@/lib/api'

const Login = React.lazy(() => import('./views/Login'))
const Matches = React.lazy(() => import('./views/Matches'))

export default function App() {
  return (
    <ApiConfigProvider baseURL="/api">
      <AppAuthProvider>
        <ApiAuthConfigProvider>
          <React.Suspense fallback={<div>Loading...</div>}>
            <AppRouter />
          </React.Suspense>
        </ApiAuthConfigProvider>
      </AppAuthProvider>
    </ApiConfigProvider>
  )
}

/**
 * Auth-aware router for the app (see {@link useAuth} for more information about the auth state).
 * 
 * If there is an authenticated user; the app will redirect into a matches table
 * allowing the clubs to consume the information about matches at their facilities.
 *
 * If there is no authenticated user; the app will redirect into a login form.
 */
function AppRouter() {
  const auth = useAuth()

  if (auth.currentUser === undefined) {
    return <div>Loading authorization...</div>
  }

  return (
    <Router>
      <Switch>
        <Route path="/login">
          {auth.currentUser
            ? <Redirect to="/matches" />
            : <Login initialValues={{ email: 'alice@playtomic.io' }}/>}
        </Route>
      
        <Route path="/matches">
          {auth.currentUser
            ? <Matches
                onLogoutRequest={() => {
                  auth.logout().catch(error => {
                    console.error('error while logging out', error)
                  })
                }}
              />
            : <Redirect to="/login" />}
        </Route>

        <Route>
          {auth.currentUser
            ? <Redirect to="/matches" />
            : <Redirect to="/login" />}
        </Route>
      </Switch>
    </Router>
  )
}

/**
 * Connects the Auth-state (as provided by {@link useAuth}) with the API fetcher.
 * 
 * This ensures every request fired with `fetcher` in the app includes a proper
 * `Authorization` header; meaning they are properly identified by the API as
 * requested by the currently authenticated users.
 */
function ApiAuthConfigProvider(props: { children: ReactNode }) {
  const auth = useAuth()

  const defaultHeaders = useMemo(() =>  {
    const headers = new Headers({
      'x-requested-with': 'playtomic-frontend-tech-task'
    })

    if (auth.tokens) {
      headers.append('authorization', `Bearer ${auth.tokens.access}`)
    }

    return headers
  }, [auth.tokens])

  return (
    <ApiConfigProvider defaultHeaders={defaultHeaders}>
      {props.children}
    </ApiConfigProvider>
  )
}

/**
 * Connects {@link AuthProvider} with a persistence-layer, allowing the user session
 * to recovered across page refreshes and visits.
 */
function AppAuthProvider(props: { children: ReactNode }) {
  type AuthProviderProps = ComponentProps<typeof AuthProvider>
  type UnwrapPromise<P> = P extends Promise<infer R> ? R : P
  type TokenSet = UnwrapPromise<NonNullable<AuthProviderProps['initialTokens']>>

  /** Local-forage based persistence layer for the auth */
  const authStore = useMemo(() => {
    const storage = localForage.createInstance({ name: 'my-app-auth' })
    const isValidTokenSet = (value: unknown): value is TokenSet => {
      return typeof value === 'object'
        && value !== null
        && 'access' in value
        && typeof value.access === 'string'
        && 'accessExpiresAt' in value
        && typeof value.accessExpiresAt === 'string'
        && 'refresh' in value
        && typeof value.refresh === 'string'
        && 'refreshExpiresAt' in value
        && typeof value.refreshExpiresAt === 'string'
    }

    return {
      /**
       * Returns a promise that resolves to the currently stored token-set.
       * If none is stored or if they are considered invalid; null is returned instead.
       */
      async get(): Promise<TokenSet | null> {
        const tokens = await storage.getItem('tokens')
        return isValidTokenSet(tokens) ? tokens : null
      },

      /**
       * Returns a promise that will be resolved once the provided tokens are stored in
       * the persistence layer. If null is provided, the tokens will be removed from
       * the storage instead.
       */
      async save(tokens: TokenSet | null): Promise<void> {
        if (tokens === null) {
          await storage.removeItem('tokens')
          return
        }

        if (!isValidTokenSet(tokens)) {
          throw new TypeError('Wrong token-set format')
        }

        await storage.setItem('tokens', tokens)
      },
    }
  }, [])

  const initialTokens = useMemo<AuthProviderProps['initialTokens']>(
    () => authStore.get(),
    [authStore],
  )
  const handleAuthRefresh = useCallback<NonNullable<AuthProviderProps['onAuthChange']>>(
    (tokens) => {
      authStore.save(tokens).catch(error => {
        console.error('Failure persisting the auth refresh', error)
      })
    },
    [authStore],
  )

  return (
    <AuthProvider initialTokens={initialTokens} onAuthChange={handleAuthRefresh}>
      {props.children}
    </AuthProvider>
  )
}
