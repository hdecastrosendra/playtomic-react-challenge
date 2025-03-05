import { Method } from './types'

/**
 * Whether or not the provided string is a valid {@link Method}
 */
function isMethod(method: string): method is Method {
  return ['GET', 'POST'].includes(method)
}

/**
 * Parses the given string into a {@link Method}-pathname tuple.
 */
function parseEndpoint(endpoint: string): [Method, string] {
  const [method, pathname] = endpoint.trim().split(/\s+/)

  if (
    typeof method !== 'string' ||
    typeof pathname !== 'string' ||
    method.length === 0 ||
    pathname.length === 0
  ) {
    throw new TypeError('Not a valid endpoint string')
  }

  if (!isMethod(method)) {
    throw new TypeError(`Unknown method (${method}) for endpoint: ${endpoint}`)
  }

  if (!pathname.startsWith('/')) {
    throw new TypeError(`Missing leading / for pathname of endpoint: ${endpoint}`)
  }

  return [method, pathname]
}

/**
 * Merges all the provided header-like values into a single {@link Headers} instance. 
 */
function mergeHeaders(...headers: (HeadersInit | null | undefined)[]): Headers {
  const result = new Headers()

  headers.forEach(headersInit => {
    const thisHeaders = new Headers(headersInit ?? undefined)

    thisHeaders.forEach((value, name) => {
      result.set(name, value)
    })
  })

  return result
}

/**
 * Given an API pathname and a set of params; returns a **path** suitable for
 * a network request.
 * 
 * Any pathname params (i.e.: values wrapped in brackets such as `{matchId}`) will
 * be replaced its value on params.
 * 
 * @throws {TypeError} a pathname-param name is not included in `params`
 */
function compilePath(pathname: string, params: URLSearchParams): string {
  if (!pathname.startsWith('/')) {
    throw new TypeError('pathname must start with /')
  }

  const resultSearchParams = new URLSearchParams(params)
  const resultPathname = pathname
    .replace(/\{(.+)\}/, (_: unknown, paramName: string) => {
      const value = resultSearchParams.get(paramName)

      if (!value) {
        throw new TypeError(`Missing param ${paramName} while compiling ${pathname}`)
      }

      resultSearchParams.delete(paramName)
      return value
    })

  return resultSearchParams.size > 0
    ? `${resultPathname}?${resultSearchParams.toString()}`
    : resultPathname
}

export { mergeHeaders, compilePath, parseEndpoint }
