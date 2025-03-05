import {
  Endpoint,
  KnownEndpoints,
  EndpointResponse,
  InferEndpointData,
  InferEndpointParams,
  InferEndpointResponse,
} from './types'
import { compilePath, mergeHeaders, parseEndpoint } from './utils'

interface ApiFetcherConfiguration {
  /**
   * If specified; any request done using this fetcher will use this value as
   * a prefix when building a full URL for any endpoint request
   */
  baseURL?: string | null | undefined

  /**
   * Allows appending extra headers to any request the fetcher performs
   */
  defaultHeaders?: Headers
}

/**
 * Extracts the request params and request data for a given endpoint and combines
 * them in a single object.
 *
 * Params (pathname or search) are passed as the root-level properties of the object
 * while request body is wrapped in a `data` property.
 */
type ApiFetcherArg<E extends Endpoint> = E extends KnownEndpoints
  ? InferEndpointParams<E> extends never
    ? InferEndpointData<E> extends never
      ? /* no params, no data */ undefined | null | Record<string, never>
      : /* no params, yes data */ { data: InferEndpointData<E> }
    : InferEndpointData<E> extends never
      ? /* yes params, no data */ InferEndpointParams<E>
      : /* yes params, yes data */ InferEndpointParams<E> & { data: InferEndpointData<E> }
  : unknown

interface ApiFetcherOptions {
  /**
   * Allows specifying extra headers for a particular request.
   */
  headers?: HeadersInit
}

interface ApiFetcher {
  <E extends KnownEndpoints>(
    endpoint: E,
    arg: ApiFetcherArg<E>,
    options?: ApiFetcherOptions,
  ): Promise<EndpointResponse<InferEndpointResponse<E>>>

  /**
   * Allows doing an unsafe, un-typed request to any non-typed endpoint.
   */
  (
    endpoint: `[unsafe] ${Endpoint}`,
    arg: Record<string, unknown>,
    options?: ApiFetcherOptions,
  ): Promise<EndpointResponse>
}

/**
 * Returns a type-safe fetch function; allowing you to call the API and automatically
 * type the response based on the endpoint being called.
 *
 * See {@link EndpointMeta} for more information on what are the supported endpoints,
 * request params, request body, and response.
 */
function createApiFetcher(configuration?: ApiFetcherConfiguration): ApiFetcher {
  const { baseURL, defaultHeaders } = configuration ?? {}

  return async <E extends KnownEndpoints>(
    endpoint: E,
    arg: ApiFetcherArg<E>,
    options?: ApiFetcherOptions,
  ): Promise<EndpointResponse<InferEndpointResponse<E>>> => {
    const [method, pathname] = parseEndpoint(endpoint)
    const headers = mergeHeaders(defaultHeaders, options?.headers)
    const { data: body, ...params } = arg as Record<string, unknown>
    const searchParams = new URLSearchParams(
      Object.entries(params).map(([paramName, paramValue]) => [paramName, String(paramValue)]),
    )
    const path = compilePath(pathname, searchParams)

    const url = `${baseURL ?? ''}${path}`

    if (body) {
      headers.set('content-type', 'application/json')
    }

    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    })

    // Yes, we know this is an unsafe cast.
    const data = (await response.json()) as InferEndpointResponse<E>

    const result: EndpointResponse<InferEndpointResponse<E>> = {
      status: response.status,
      ok: response.ok,
      headers: response.headers,
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any --
       * FIXME: We need this any casting because of the response/error discriminate typing;
       * Let's find a way to better type this in the future if possible.
       */
      data: data as any,
    }

    return result
  }
}

export { createApiFetcher, type ApiFetcher, type ApiFetcherArg, type ApiFetcherOptions }
