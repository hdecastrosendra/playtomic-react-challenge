import { compilePath, mergeHeaders, parseEndpoint } from './utils'

describe('compilePath', () => {
  test('includes params as search at the end of the pathname', () => {
    const pathname = '/v1/matches'
    const params = new URLSearchParams({ size: '1', page: '10' })
    expect(compilePath(pathname, params)).toEqual('/v1/matches?size=1&page=10')
  })

  test('replaces pathname-params with its associated value', () => {
    const pathname = '/v1/matches/{matchId}'
    const params = new URLSearchParams({ matchId: 'abc' })
    expect(compilePath(pathname, params)).toEqual('/v1/matches/abc')
  })

  test('replaces pathname-params and includes search params', () => {
    const pathname = '/v1/matches/{matchId}'
    const params = new URLSearchParams({ matchId: 'abc', withPlayers: 'true' })
    expect(compilePath(pathname, params)).toEqual('/v1/matches/abc?withPlayers=true')
  })

  test('throws a TypeError if a pathname-params is not included in params', () => {
    const pathname = '/v1/matches/{matchId}'
    const params = new URLSearchParams()
    expect(() => compilePath(pathname, params)).toThrowError(
      `Missing param matchId while compiling ${pathname}`,
    )
  })
})

describe('mergeHeaders', () => {
  /**
   * Transform a {@link Headers} instance into a `expect(...)` friendly value
   */
  const serializeHeaders = (headers: Headers): [string, string][] => Array.from(headers.entries())

  test('merges different header-compatible values into a single Headers', () => {
    expect(
      serializeHeaders(
        mergeHeaders(new Headers({ header01: 'value01' }), [['header02', 'value02']], {
          header03: 'value03',
        }),
      ),
    ).toEqual([
      ['header01', 'value01'],
      ['header02', 'value02'],
      ['header03', 'value03'],
    ])
  })

  test('colliding header values are solved to the right-most value', () => {
    expect(serializeHeaders(mergeHeaders([['header02', 'value02_A']], [['header02', 'value02_B']]))).toEqual([
      ['header02', 'value02_B'],
    ])
  })
})

describe('parseEndpoint', () => {
  test('returns a method-pathname tuple for an endpoint string', () => {
    expect(parseEndpoint('GET /v1/matches')).toEqual(['GET', '/v1/matches'])
  })

  test('returns a method-pathname tuple for an endpoint string with inconsistent spacing', () => {
    expect(parseEndpoint('GET       /v1/matches')).toEqual(['GET', '/v1/matches'])
  })

  test('throws for a non-endpoint string', () => {
    expect(() => parseEndpoint('')).toThrowError('Not a valid endpoint string')
  })

  test('throws for a non-valid method string', () => {
    expect(() => parseEndpoint('GOT /v1/matches')).toThrowError(
      'Unknown method (GOT) for endpoint: GOT /v1/matches',
    )
  })

  test('throws for a pathname with no leading /', () => {
    expect(() => parseEndpoint('GET v1/matches')).toThrowError(
      'Missing leading / for pathname of endpoint: GET v1/matches',
    )
  })
})
