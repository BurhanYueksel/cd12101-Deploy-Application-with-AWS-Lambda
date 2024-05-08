import { decode } from 'jsonwebtoken';

export function getUserId(authorizationHeader) {
  const token = getToken(authorizationHeader);
  const decodedToken = decode(token);

  return decodedToken.sub;
}

function getToken(authorizationHeader) {
  if (!authorizationHeader) {
    throw new Error('Authorization header is missing');
  }

  if (!authorizationHeader.startsWith('Bearer ')) {
    throw new Error('Invalid authorization header');
  }

  const split = authorizationHeader.split(' ');
  const token = split[1];

  return token;
}