import jsonwebtoken from 'jsonwebtoken'

export function getUserId(authorizationHeader) {

  const split = authorizationHeader.split(' ')
  const jwtToken = split[1]

  const decodedJwt = jsonwebtoken.decode(jwtToken)
  return decodedJwt.sub
}

export function parseUserId(event) {
  // Check if 'requestContext' exists in the event
  if (event.requestContext) {
    // Check if 'authorizer' exists in the request context
    if (event.requestContext.authorizer) {
      // Extract the 'claims' object from the authorizer
      const claims = event.requestContext.authorizer.claims;
      // Extract the user ID from the claims object
      const userId = claims.sub;
      return userId;
    }
  }

  // If the user ID cannot be extracted, return null
  return null;
}


