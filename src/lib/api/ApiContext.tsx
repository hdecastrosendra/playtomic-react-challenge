import React, { ReactNode, useContext, useMemo } from 'react'
import { mergeHeaders } from './utils'

interface ApiContextValue {
  /**
   * If specified; any request done using fetcher will use this as a prefix
   * when building a full URL for any endpoint request
   */
  baseURL: string | null | undefined

  /**
   * Allows appending extra headers to any request the fetcher performs
   */
  defaultHeaders: Headers
}

const ApiContext = React.createContext<ApiContextValue>({
  baseURL: null,
  defaultHeaders: new Headers(),
})

interface ApiContextProviderProps extends Partial<ApiContextValue> {
  children?: ReactNode
}

/**
 * Allows configuring the default behavior of the API fetcher.
 */
function ApiContextProvider(props: ApiContextProviderProps) {
  const { defaultHeaders, baseURL, ...otherProps } = props
  const parentValue = useContext(ApiContext)
  const value = useMemo<ApiContextValue>(() => ({
    baseURL: baseURL ?? parentValue.baseURL,
    defaultHeaders: mergeHeaders(parentValue.defaultHeaders, defaultHeaders)
  }), [parentValue, defaultHeaders, baseURL])

  return (
    <ApiContext.Provider value={value} {...otherProps} />
  )
}

export { ApiContext, ApiContextProvider }
