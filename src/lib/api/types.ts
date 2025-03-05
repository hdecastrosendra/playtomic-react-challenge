import type { Match, User } from '@/lib/api-types'

type Method = 'GET' | 'POST'
type Endpoint<M extends Method = Method, U extends string = string> = `${M} ${U}`

/**
 * Mapping of every supported endpoint into its related types:
 * - request params (query and pathname-params)
 * - request data (body serialized as JSON)
 * - response body
 * 
 * See the README on `lib/msw` for a full list of available endpoints
 */
interface EndpointMeta {
  'GET /v1/matches': {
    params: { size?: number, page?: number },
    data: never,
    response: Match[],
  }

  'GET /v1/matches/{matchId}': {
    params: { matchId: string },
    data: never,
    response: Match,
  }

  'GET /v1/users/me': {
    params: never,
    data: never,
    response: User,
  }

  'POST /v3/auth/login': {
    params: never,
    data: {
      email: string,
      password: string,
    },
    response: {
      accessToken: string,
      accessTokenExpiresAt: string,
      refreshToken: string,
      refreshTokenExpiresAt: string,
    },
  }

  'POST /v3/auth/refresh': {
    params: never,
    data: {
      refreshToken: string,
    },
    response: {
      accessToken: string,
      accessTokenExpiresAt: string,
      refreshToken: string,
      refreshTokenExpiresAt: string,
    },
  }
}

/**
 * All known endpoints.
 */
type KnownEndpoints = Extract<keyof EndpointMeta, Endpoint>

/**
 * Given an endpoint; allows inferring the parameters (pathname and query) accepted
 * when invoking it. If the endpoint provided does not match any known endpoint the
 * resolved type will be `unknown`.
 */
type InferEndpointParams<E extends Endpoint> =
  E extends KnownEndpoints
    ? EndpointMeta[E]['params']
    : unknown

/**
 * Given an endpoint; allows inferring the data (body sent in the request) accepted
 * when invoking it. If the endpoint provided does not match any known endpoint the
 * resolved type will be `unknown`.
 */
type InferEndpointData<E extends Endpoint> =
  E extends KnownEndpoints
    ? EndpointMeta[E]['data']
    : unknown

/**
 * Given an endpoint; allows inferring the response type returned when invoking it.
 * If the endpoint provided does not match any known endpoint the resolved type
 * will be `unknown`.
 */
type InferEndpointResponse<E extends Endpoint> =
  E extends KnownEndpoints
    ? EndpointMeta[E]['response']
    : unknown


interface BaseEndpointResponse<R = unknown> {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/headers) */
    readonly headers: Headers;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/ok) */
    readonly ok: boolean;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/status) */
    readonly status: number;
    /** Content of the JSON-parsed response */
    readonly data: R;
}

type EndpointResponse<R = unknown, E = { message: string }> = 
  | BaseEndpointResponse & { ok: true, data: R }
  | BaseEndpointResponse & { ok: false, data: E }

export {
  type Method,
  type Endpoint,
  type EndpointMeta,
  type KnownEndpoints,
  type InferEndpointParams,
  type InferEndpointData,
  type InferEndpointResponse,
  type EndpointResponse,
}
