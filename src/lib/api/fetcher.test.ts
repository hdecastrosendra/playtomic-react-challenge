import { Match, User } from '@/lib/api-types'
import { createApiFetcher } from './fetcher'
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'

const serverSpy = vi.fn()
const server = setupServer(
  http.all('*', async ({ request }) => {
    const url = new URL(request.url)
    const req = {
      method: request.method,
      pathname: url.pathname,
      searchParams: Object.fromEntries(url.searchParams.entries()),
      headers: Object.fromEntries(request.headers.entries()),
      data: await request.json().catch(() => null),
    }

    serverSpy(req)
    return HttpResponse.json(req)
  }),
)

beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

test('can perform a GET request', async () => {
  const fetch = createApiFetcher()
  await fetch('GET /v1/matches', { size: 10 })

  expect(serverSpy).toHaveBeenCalledWith({
    method: 'GET',
    pathname: '/v1/matches',
    searchParams: { size: '10' },
    headers: {},
    data: null,
  })
})

test('can perform a POST request', async () => {
  const fetch = createApiFetcher()
  await fetch('POST /v3/auth/login', {
    data: { email: 'email', password: 'password' },
  })

  expect(serverSpy).toHaveBeenCalledWith({
    method: 'POST',
    pathname: '/v3/auth/login',
    searchParams: {},
    headers: { 'content-type': 'application/json' },
    data: { email: 'email', password: 'password' },
  })
})

test('baseURL can be used to add a prefix to the request pathname', async () => {
  const baseURL = '/api'
  const fetch = createApiFetcher({ baseURL })
  await fetch('GET /v1/users/me', {})

  expect(serverSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      pathname: '/api/v1/users/me',
    }),
  )
})

test('defaultHeaders are appended to every request', async () => {
  const defaultHeaders = new Headers({ foo: 'bar' })
  const fetch = createApiFetcher({ defaultHeaders })
  await fetch('GET /v1/users/me', {})

  expect(serverSpy).toHaveBeenCalledWith({
    method: 'GET',
    pathname: '/v1/users/me',
    searchParams: {},
    headers: { foo: 'bar' },
    data: null,
  })
})

test('request headers are appended to the request', async () => {
  const fetch = createApiFetcher()
  const headers = new Headers({ foo: 'bar' })
  await fetch('GET /v1/users/me', {}, { headers })

  expect(serverSpy).toHaveBeenCalledWith({
    method: 'GET',
    pathname: '/v1/users/me',
    searchParams: {},
    headers: { foo: 'bar' },
    data: null,
  })
})

test('request headers override default', async () => {
  const defaultHeaders = new Headers({ foo: 'baz' })
  const fetch = createApiFetcher({ defaultHeaders })
  const headers = new Headers({ foo: 'bar' })
  await fetch('GET /v1/users/me', {}, { headers })

  expect(serverSpy).toHaveBeenCalledWith({
    method: 'GET',
    pathname: '/v1/users/me',
    searchParams: {},
    headers: { foo: 'bar' },
    data: null,
  })
})

describe('types', () => {
  /* eslint-disable @typescript-eslint/consistent-type-definitions */
  type ResponseError = { message: string }

  test('GET /v1/matches', async () => {
    type Arg = { size?: number; page?: number }
    const arg: Arg = {}

    const fetch = createApiFetcher()
    const res = await fetch('GET /v1/matches', arg)

    expectTypeOf(res.data).toEqualTypeOf<Match[] | ResponseError>()
  })

  test('GET /v1/matches/{matchId}', async () => {
    type Arg = { matchId: string }
    const arg: Arg = { matchId: 'my-match' }

    const fetch = createApiFetcher()
    const res = await fetch('GET /v1/matches/{matchId}', arg)

    expectTypeOf(res.data).toEqualTypeOf<Match | ResponseError>()
  })

  test('GET /v1/users/me', async () => {
    type Arg = Record<string, never> | null | undefined
    const arg: Arg = {}

    const fetch = createApiFetcher()
    const res = await fetch('GET /v1/users/me', arg)

    expectTypeOf(res.data).toEqualTypeOf<User | ResponseError>()
  })

  test('POST /v3/auth/login', async () => {
    type Arg = { data: { email: string; password: string } }
    const arg: Arg = { data: { email: 'email', password: 'password' } }

    const fetch = createApiFetcher()
    const res = await fetch('POST /v3/auth/login', arg)

    type ResponseOk = {
      accessToken: string
      accessTokenExpiresAt: string
      refreshToken: string
      refreshTokenExpiresAt: string
    }
    expectTypeOf(res.data).toEqualTypeOf<ResponseOk | ResponseError>()
  })

  test('POST /v3/auth/refresh', async () => {
    type Arg = { data: { refreshToken: string } }
    const arg: Arg = { data: { refreshToken: 'refreshToken' } }

    const fetch = createApiFetcher()
    const res = await fetch('POST /v3/auth/refresh', arg)

    type ResponseOk = {
      accessToken: string
      accessTokenExpiresAt: string
      refreshToken: string
      refreshTokenExpiresAt: string
    }
    expectTypeOf(res.data).toEqualTypeOf<ResponseOk | ResponseError>()
  })
})
