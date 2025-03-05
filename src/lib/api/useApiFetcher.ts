import { useContext, useMemo } from 'react'
import { ApiContext } from './ApiContext'
import { ApiFetcher, createApiFetcher } from './fetcher'

/**
 * Returns a type-safe fetch function; allowing you to call the API while automatically
 * typing the response based on the endpoint being called.
 *
 * See {@link createApiFetcher} for more information.
 *
 * @example Doing a POST request
 * ```ts
 * const fetcher = useApiFetcher()
 * const doSomething = async () => {
 *   const res = await fetcher('POST /v3/auth/login', {
 *     data: { email: '...', password: '...' }
 *   })
 *
 *   if (!res.ok) {
 *     throw new Error(res.data.message)
 *   }
 *
 *   console.log(res.data.accessToken)
 * }
 * ```
 *
 * @example Usage with SWR
 * ```ts
 * type Arg = { page?: number, size?: number }
 * const matches = useSWR({ page, size }, async (arg: Arg): Promise<Match[]> => {
 *   const res = await fetcher('GET /v1/matches', arg)
 *
 *   if (!res.ok) {
 *     throw new Error(res.data.message)
 *   }
 *
 *   const totalCount = res.headers.get('total')
 *   const total = totalCount ? Number.parseInt(totalCount) : res.data.length
 *   return { matches: res.data, total }
 * })
 * ```
 */
function useApiFetcher(): ApiFetcher {
  const apiContext = useContext(ApiContext)

  const fetcher: ApiFetcher = useMemo(
    (): ApiFetcher =>
      createApiFetcher({
        baseURL: apiContext.baseURL,
        defaultHeaders: apiContext.defaultHeaders,
      }),
    [apiContext],
  )

  return fetcher
}

export { useApiFetcher }
