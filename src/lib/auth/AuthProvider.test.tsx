import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from './AuthProvider'
import { useAuth } from './useAuth'
import { TokensData } from './types'
import { server } from '@/lib/msw/node'
import { http, HttpResponse } from 'msw'
import { ApiConfigProvider } from '@/lib/api'
import { vi } from 'vitest'
import { ReactNode } from 'react'

const validAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDkyOTA0NzIsImV4cCI6NDg2Mjg5MDQ3MiwianRpIjoiYzFjMGVjNTMtMzc1Ny00Y2FjLTk5YTMtZjk3NDAwMTA5ZTFkIiwic3ViIjoiYzBlZDM2YzAtNmM1OS00OGQ0LWExNjgtYjYwNzZjZWM1MmEwIiwidHlwZSI6ImFjY2VzcyJ9.InRoaXMtaXMtbm90LWEtcmVhbC1zaWduYXR1cmUi'
const validRefreshToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDkyOTA0NzIsImV4cCI6NDg2Mjg5MDQ3MiwianRpIjoiYzFjMGVjNTMtMzc1Ny00Y2FjLTk5YTMtZjk3NDAwMTA5ZTFkIiwic3ViIjoiYzBlZDM2YzAtNmM1OS00OGQ0LWExNjgtYjYwNzZjZWM1MmEwIiwidHlwZSI6InJlZnJlc2gifQ.a97Pqc9uo3YjPtAfJu1CbYh_CyU2IH-Ew6eaR7yST6g'

beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

const Wrapper = (props: {
  children: ReactNode
  initialTokens?: TokensData | null | undefined
  onAuthChange?: (tokens: TokensData | null) => void
}) => (
  <ApiConfigProvider baseURL="/api">
    <AuthProvider initialTokens={props.initialTokens} onAuthChange={props.onAuthChange}>
      {props.children}
    </AuthProvider>
  </ApiConfigProvider>
)

// Test component to display authentication state
function TestComponent() {
  const auth = useAuth()

  return (
    <div>
      <div data-testid="auth-state">
        {auth.currentUser
          ? 'authenticated'
          : auth.tokens === undefined
          ? 'loading'
          : 'not-authenticated'}
      </div>
      {auth.currentUser && (
        <div data-testid="user-info">
          {auth.currentUser.name} ({auth.currentUser.email})
        </div>
      )}
      <button
        data-testid="login-button"
        onClick={() => {
          void auth.login({
            email: 'alice@playtomic.io',
            password: 'MySuperSecurePassword',
          })
        }}
      >
        Login
      </button>
      <button
        data-testid="logout-button"
        onClick={() => {
          void auth.logout()
        }}
      >
        Logout
      </button>
    </div>
  )
}

function AuthConsumer() {
  const auth = useAuth()

  return (
    <div>
      <div data-testid="auth-state">
        {auth.currentUser
          ? 'authenticated'
          : auth.tokens === undefined
          ? 'loading'
          : 'not-authenticated'}
      </div>
    </div>
  )
}

describe('AuthProvider', () => {
  test('initially, currentUser and tokens are undefined', () => {
    server.use(
      http.get('/v1/users/me', () => {
        return new HttpResponse(null, { status: 200 })
      })
    )

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    )

    expect(screen.getByTestId('auth-state').textContent).toBe('not-authenticated')
  })

  test('when there are no initial tokens, currentUser and tokens are set to null', async () => {
    render(
      <Wrapper initialTokens={null}>
        <TestComponent />
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('not-authenticated')
    })
  })

  test('when there are initial tokens, user information is retrieved', async () => {
    const mockTokens: TokensData = {
      access: validAccessToken,
      accessExpiresAt: '2124-01-01T00:00Z',
      refresh: validRefreshToken,
      refreshExpiresAt: '2124-01-01T00:00Z',
    }

    server.use(
      http.get('/v1/users/me', ({ request }) => {
        const auth = request.headers.get('authorization')
        if (!auth || !auth.includes(validAccessToken)) {
          return new HttpResponse(null, { status: 401 })
        }

        return HttpResponse.json({
          userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
          displayName: 'Alice',
          email: 'alice@playtomic.io',
          pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
        })
      })
    )

    render(
      <Wrapper initialTokens={mockTokens}>
        <TestComponent />
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('authenticated')
      expect(screen.getByTestId('user-info').textContent).toBe('Alice (alice@playtomic.io)')
    })
  })

  test('login correctly sets currentUser and tokens', async () => {
    server.use(
      http.get('/v1/users/me', () => {
        return HttpResponse.json({
          userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
          name: 'Alice',
          email: 'alice@playtomic.io',
          pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
        })
      })
    )

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('not-authenticated')
    })

    await act(async () => {
      await userEvent.click(screen.getByTestId('login-button'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('authenticated')
      expect(screen.getByTestId('user-info').textContent).toBe('Alice (alice@playtomic.io)')
    })
  })

  test('logout sets currentUser and tokens to null', async () => {
    const mockTokens: TokensData = {
      access: validAccessToken,
      accessExpiresAt: '2124-01-01T00:00Z',
      refresh: validRefreshToken,
      refreshExpiresAt: '2124-01-01T00:00Z',
    }

    server.use(
      http.get('/v1/users/me', ({ request }) => {
        const auth = request.headers.get('authorization')
        if (!auth || !auth.includes(validAccessToken)) {
          return new HttpResponse(null, { status: 401 })
        }

        return HttpResponse.json({
          userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
          displayName: 'Alice',
          email: 'alice@playtomic.io',
          pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
        })
      })
    )

    render(
      <Wrapper initialTokens={mockTokens}>
        <TestComponent />
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('authenticated')
    })

    await userEvent.click(screen.getByTestId('logout-button'))

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('not-authenticated')
    })
  })

  test('onAuthChange is called with tokens when authentication state changes', async () => {
    server.use(
      http.get('/v1/users/me', () => {
        return HttpResponse.json({
          userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
          name: 'Alice',
          email: 'alice@playtomic.io',
          pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
        })
      }),
      http.post('/v3/auth/login', () => {
        return HttpResponse.json({
          access: validAccessToken,
          accessExpiresAt: '2124-01-01T00:00Z',
          refresh: validRefreshToken,
          refreshExpiresAt: '2124-01-01T00:00Z',
        })
      })
    )

    const onAuthChange = vi.fn()

    render(
      <Wrapper onAuthChange={onAuthChange}>
        <TestComponent />
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('not-authenticated')
    })

    onAuthChange.mockClear()

    await act(async () => {
      await userEvent.click(screen.getByTestId('login-button'))
    })

    await waitFor(() => {
      expect(onAuthChange).toHaveBeenCalled()
      const mockCalls = onAuthChange.mock.calls as [TokensData | null][]
      expect(mockCalls.length).toBeGreaterThan(0)
      const lastCall = mockCalls[mockCalls.length - 1]
      expect(lastCall[0]).not.toBeNull()
      expect(lastCall[0]?.access).toBeDefined()
    })

    onAuthChange.mockClear()

    await act(async () => {
      await userEvent.click(screen.getByTestId('logout-button'))
    })

    await waitFor(() => {
      expect(onAuthChange).toHaveBeenCalledWith(null)
    })
  })

  test('when there is an error retrieving user information, currentUser and tokens are set to null', async () => {
    const mockTokens: TokensData = {
      access: 'test-access-token',
      accessExpiresAt: new Date(Date.now() + 3600000).toISOString(),
      refresh: 'test-refresh-token',
      refreshExpiresAt: new Date(Date.now() + 86400000).toISOString(),
    }

    server.use(
      http.get('/v1/users/me', () => {
        return new HttpResponse(null, { status: 401 })
      })
    )

    render(
      <Wrapper initialTokens={mockTokens}>
        <TestComponent />
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('not-authenticated')
    })
  })

  test('can be initialized with tokens and retrieve user information', async () => {
    server.use(
      http.get('/v1/users/me', ({ request }) => {
        const auth = request.headers.get('authorization')
        if (!auth || !auth.includes(validAccessToken)) {
          return new HttpResponse(null, { status: 401 })
        }

        return HttpResponse.json({
          userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
          name: 'Alice',
          email: 'alice@playtomic.io',
          pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
        })
      })
    )

    const mockTokens: TokensData = {
      access: validAccessToken,
      accessExpiresAt: '2124-01-01T00:00Z',
      refresh: validRefreshToken,
      refreshExpiresAt: '2124-01-01T00:00Z',
    }

    render(
      <Wrapper initialTokens={mockTokens}>
        <AuthConsumer />
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('authenticated')
    })
  })

  test('can login and logout', async () => {
    server.use(
      http.get('/v1/users/me', () => {
        return HttpResponse.json({
          userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
          name: 'Alice',
          email: 'alice@playtomic.io',
          pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
        })
      })
    )

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('not-authenticated')
    })

    await act(async () => {
      await userEvent.click(screen.getByTestId('login-button'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('authenticated')
    })

    await act(async () => {
      await userEvent.click(screen.getByTestId('logout-button'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('not-authenticated')
    })
  })
})
