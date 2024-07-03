import Axios from 'axios'
import { verify, decode } from 'jsonwebtoken';

const jwksUrl = 'https://dev-pszzc6ujqjora7xk.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)
    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log(`User not authorized', error: ${e.message}`);

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader);
  const jwt = decode(token, {complete: true });
  const jwtKid = jwt.header.kid;
  let cert;

  try{
    const jwks = await Axios.get(jwksUrl);
    const signingKey = jwks.data.keys.filter(k => k.kid === jwtKid)[0];

    if (!signingKey) {
      throw new Error(`Unable to find a signing key that matches ' ${jwtKid}'`);
    }
    const { x5c } = signingKey;

    cert = `-----BEGIN CERTIFICATE-----

-----END CERTIFICATE-----`;
  } catch(error) {
    console.log('Error while getting Certificate : ' , error);
  }

   return verify(token, cert, { algorithms: ['RS256'] });
}


function getToken(authHeader) {

  if(!authHeader) throw new Error('No authentication header')


  if(!authHeader.toLowerCase().startsWith('bearer '))
     throw new Error('Invalid authorization header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token

}
