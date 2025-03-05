import { Auth } from './types'

/**
 * Returns the current auth state. See {@link Auth} for more information on
 * what is included there.
 *
 * @throws {TypeError} if called from a component not descendant of AuthProvider
 */
function useAuth(): Auth {
  return {
    tokens: null,
    currentUser: null,
    login(credentials) {
      const { email, password } = credentials
      return Promise.reject(new Error('Not yet implemented'))
    },
    logout() {
      return Promise.reject(new Error('Not yet implemented'))
    },
  }
}

export { useAuth }
