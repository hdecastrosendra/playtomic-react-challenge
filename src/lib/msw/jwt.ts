/**
 * Naïve jsonwebtoken client-side implementation.
 *
 * This implementation is just for learning purposes and is not secure
 * nor it should be used in production under any circumstance!
 */

/**
 * JSON web tokens claims.
 *
 * This is a non-exhaustive list and includes just the ones we need for this
 * project!
 *
 * @see https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims
 * @see https://www.iana.org/assignments/jwt/jwt.xhtml#claims
 */
interface JWTClaims {
  exp?: number
  iat?: number
  jti?: string
  sub?: string
  [customClaims: string]: string | number | undefined
}

/**
 * Serializes a list of token parts into a {@link Headers}-friendly token.
 */
function serialize(...values: unknown[]): string {
  return values.map(value => btoa(JSON.stringify(value)).replace(/=+$/, '')).join('.')
}

/**
 * Parses the given token into its composing parts.
 */
function parse(token: string): unknown[] {
  return token.split('.').map((part): unknown => JSON.parse(atob(part)))
}

/**
 * Creates a JSON web token with the provided claims.
 */
async function sign(payload: JWTClaims): Promise<string> {
  const header = {
    alg: 'HS256' as const,
    typ: 'JWT',
  }

  const token = serialize(header, payload, serialize('not-a-real-signature'))

  return Promise.resolve(token)
}

/**
 * Decodes and parses the provided token into its parts: header, payload and signature.
 * IMPORTANT: This function does not verify the signature of the token!
 */
async function decode(token: string): Promise<{ header: unknown; payload: JWTClaims; signature: unknown }> {
  const [header, payload, signature] = parse(token)
  const parsedToken = {
    header: header ?? {},
    signature: signature ?? {},
    // Yes, this is an unsafe cast; but for the sake of simplicity we need to do this
    payload: (payload ?? {}) as JWTClaims,
  }

  return Promise.resolve(parsedToken)
}

export { decode, sign }
