import { useContext } from 'react'
import { Auth } from './types'
import { AuthContext } from './AuthContext'

/**
 * Returns the current auth state. See {@link Auth} for more information on
 * what is included there.
 *
 * @throws {TypeError} if called from a component not descendant of AuthProvider
 */
function useAuth(): Auth {
  const auth = useContext(AuthContext)

  if (auth === null) {
    throw new TypeError('useAuth must be used within an AuthProvider')
  }

  return auth
}

export { useAuth }
