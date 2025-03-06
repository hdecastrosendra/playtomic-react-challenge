import { render } from '@testing-library/react'
import { useAuth } from './useAuth'
import { AuthContext } from './AuthContext'
import { Auth } from './types'
import { vi } from 'vitest'

// Authentication context mock
const mockAuth: Auth = {
  currentUser: {
    userId: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
  },
  tokens: {
    access: 'test-access-token',
    accessExpiresAt: new Date(Date.now() + 3600000).toISOString(),
    refresh: 'test-refresh-token',
    refreshExpiresAt: new Date(Date.now() + 86400000).toISOString(),
  },
  login: vi.fn(),
  logout: vi.fn(),
}

// Test component that uses the useAuth hook
function TestComponent({ onAuth }: { onAuth: (auth: Auth) => void }) {
  const auth = useAuth()
  onAuth(auth)
  return null
}

describe('useAuth', () => {
  test('returns the authentication context when available', () => {
    const onAuth = vi.fn()

    render(
      <AuthContext.Provider value={mockAuth}>
        <TestComponent onAuth={onAuth} />
      </AuthContext.Provider>
    )

    expect(onAuth).toHaveBeenCalledWith(mockAuth)
  })

  test('throws an error when used outside an AuthProvider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      /* Silence console errors */
    })

    const renderOutsideProvider = () => {
      render(<TestComponent onAuth={vi.fn()} />)
    }

    expect(renderOutsideProvider).toThrow('useAuth must be used within an AuthProvider')

    consoleErrorSpy.mockRestore()
  })
})
