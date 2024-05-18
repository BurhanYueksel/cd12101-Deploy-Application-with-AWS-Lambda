import jsonwebtoken from 'jsonwebtoken';

export function getUserId(authorizationHeader) {
  const split = authorizationHeader.split(' ');
  const jwtToken = split[1];

  const decodedJwt = jsonwebtoken.decode(jwtToken)
  return decodedJwt.sub;
}

//@TODO Implement something to actually parse the userId from the jwtToken
export function parseUserId(jwtToken) {
  return 'Burhan';
}

