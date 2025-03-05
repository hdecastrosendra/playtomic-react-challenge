import { HttpResponse, type RequestHandler, http } from 'msw'
import { Match } from '@/lib/api-types'
import * as mockData from './data'
import * as jwt from './jwt'

/**
 * List of REST handlers for msw instances. Used for tests and development environments.
 *
 * See the README for a detailed list of endpoints; params and responses.
 * 
 * @see https://mswjs.io/docs/concepts/request-handler
 */
export const handlers: RequestHandler[] = [
  http.post('/api/v3/auth/login', async ({ request }) => {
    type ResponseType =
      | { accessToken: string, accessTokenExpiresAt: string, refreshToken: string, refreshTokenExpiresAt: string }
      | { message: string }
    const data = await request.json()
    const hasProperty = <P extends string>(value: unknown, property: P): value is { [Key in P]: unknown } =>
      typeof value === 'object' && value !== null && property in value

    const email = hasProperty(data, 'email') && typeof data.email === 'string'  && data.email.length > 0
      ? data.email
      : null      
    const password = hasProperty(data, 'password') && typeof data.password === 'string'  && data.password.length > 0
      ? data.password
      : null
      
    if (email === null) {
      return HttpResponse.json<ResponseType>(
        { message: 'Missing email' },
        { status: 400 },
      )
    }

    if (password === null) {
      return HttpResponse.json<ResponseType>(
        { message: 'Missing password' },
        { status: 400 },
      )
    }

    const authData = mockData.findOne('auth', mock => mock.email === email)

    if (!authData) {
      return HttpResponse.json<ResponseType>(
        { message: 'Unknown email' },
        { status: 401 },
      )
    }

    if (authData.password !== password) {
      return HttpResponse.json<ResponseType>(
        // Because we are in a development environment; telling the client the actual
        // password is not a security issue
        { message: `Wrong password. Maybe try ${authData.password}` },
        { status: 401 },
      )
    }

    const user = mockData.findOne('user', (mock) => mock.email === email)

    if (!user) {
      return HttpResponse.json<ResponseType>(
        { message: `Missing mock data for user ${email}` },
        { status: 500 },
      )
    }

    const now = Math.floor(Date.now() / 1000)
    const accessTokenExpiresAt = now + /*1h*/ 1 * 60 * 60
    const refreshTokenExpiresAt = now + /*7d*/ 7 * 24 * 60 * 60

    const accessToken = await jwt.sign({
      iat: now,
      exp: accessTokenExpiresAt,
      jti: crypto.randomUUID(),
      sub: user.userId,
      type: 'access',
    })
    const refreshToken = await jwt.sign({
      iat: now,
      exp: refreshTokenExpiresAt,
      jti: crypto.randomUUID(),
      sub: user.userId,
      type: 'refresh',
    })

    return HttpResponse.json<ResponseType>(
      {
        accessToken,
        accessTokenExpiresAt: new Date(accessTokenExpiresAt * 1000).toISOString(),
        refreshToken,
        refreshTokenExpiresAt: new Date(refreshTokenExpiresAt * 1000).toISOString(),
      },
      { status: 200 },
    )
  }),

  http.post('/api/v3/auth/refresh', async ({ request }) => {
    type ResponseType =
      | { accessToken: string, accessTokenExpiresAt: string, refreshToken: string, refreshTokenExpiresAt: string }
      | { message: string }
    const data = await request.json()
    const hasProperty = <P extends string>(value: unknown, property: P): value is { [Key in P]: unknown } =>
      typeof value === 'object' && value !== null && property in value

    const refreshTokenRaw = hasProperty(data, 'refreshToken') && typeof data.refreshToken === 'string'  && data.refreshToken.length > 0
      ? data.refreshToken
      : null      
      
    if (refreshTokenRaw === null) {
      return HttpResponse.json<ResponseType>(
        { message: 'Missing refresh token' },
        { status: 400 },
      )
    }

    const refreshToken = await jwt.decode(refreshTokenRaw)
    const refreshTokenExpiresAt = refreshToken.payload.exp ? refreshToken.payload.exp * 1000 : undefined

    if (!refreshTokenExpiresAt || refreshTokenExpiresAt <= Date.now()) {
      return HttpResponse.json(
        { message: 'Refresh token is expired.' },
        { status: 403 },
      )
    }

    const userId = refreshToken.payload.sub
    const now = Math.floor(Date.now() / 1000)
    const accessTokenExpiresAt = now + /*1h*/ 1 * 60 * 60

    const accessToken = await jwt.sign({
      iat: now,
      exp: accessTokenExpiresAt,
      jti: crypto.randomUUID(),
      sub: userId,
      type: 'access',
    })

    return HttpResponse.json<ResponseType>(
      {
        accessToken,
        accessTokenExpiresAt: new Date(accessTokenExpiresAt * 1000).toISOString(),
        refreshToken: refreshTokenRaw,
        refreshTokenExpiresAt: new Date(refreshTokenExpiresAt).toISOString(),
      },
      { status: 200 },
    )
  }),

  http.all('/api/*', async ({ request }) => {
    const auth = request.headers.get('authorization')

    if (!auth) {
      return HttpResponse.json(
        { message: 'Missing authorization header' },
        { status: 401 },
      )
    }

    const [authType, rawToken] = auth.split(' ')

    if (authType !== 'Bearer' || !rawToken) {
      return HttpResponse.json(
        { message: 'Wrong authorization format. Expected "Bearer {token}".' },
        { status: 401 },
      )
    }

    const token = await jwt.decode(rawToken)
    const expiration = token.payload.exp

    if (!expiration || (expiration * 1000) <= Date.now()) {
      return HttpResponse.json(
        { message: 'Token expired. Try refreshing it using a refreshToken.' },
        { status: 403 },
      )
    }

    // Allow the request to go through other handlers
    return  
  }),

  http.get('/api/v1/users/me', async ({ request }) => {
    const authorization = request.headers.get('authorization')
    const [bearer, rawToken] = authorization?.split(' ') ?? []

    if (bearer !== 'Bearer' || !rawToken) {
      return HttpResponse.json(null, { status: 401 })
    }

    const token = await jwt.decode(rawToken)

    const userId = token.payload.sub
    const user = mockData.findOne('user',  user => user.userId === userId)
    return HttpResponse.json(user)
  }),

  http.get('/api/v1/matches', ({ request }) => {
    type ResponseType =
      | Match[]
      | { message: string }
  
    const url = new URL(request.url)

    const size = Number.parseInt(url.searchParams.get('size') ?? '10')
    const page = Number.parseInt(url.searchParams.get('page') ?? '0')

    if (size > 10) {
      return HttpResponse.json<ResponseType>(
        { message: 'size can\'t be larger than 10'},
        { status: 400 },
      )
    }

    const allMatches = mockData.findMany('match', () => true)
    const matches = allMatches.slice(size * page, size * page + size)
    const headers = new Headers({ 'Total': `${allMatches.length}` })

    return HttpResponse.json<ResponseType>(
      matches,
      { status: 200, headers },
    )
  }),

  http.get('/api/v1/matches/:matchId', ({ params }) => {
    const match = mockData.findOne('match',  match => match.matchId === params.matchId)

    if (!match) {
      return HttpResponse.json(null, { status: 404 })
    }

    return HttpResponse.json(match)
  }),

  http.get('/api/*', () => {
    // If we reach this handler it means we received a request for an unknown endpoint.
    return HttpResponse.json(null, { status: 404 })
  })
]
