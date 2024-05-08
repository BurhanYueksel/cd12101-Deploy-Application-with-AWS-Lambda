import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const certificate : string = '-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJCwZdTZyjQaOwMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1wc3p6YzZ1anFqb3JhN3hrLnVzLmF1dGgwLmNvbTAeFw0yNDA1MDYx
MjIxMTBaFw0zODAxMTMxMjIxMTBaMCwxKjAoBgNVBAMTIWRldi1wc3p6YzZ1anFq
b3JhN3hrLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAKztYEU29LZbsDh46ZYbgLGrqWGou9FLOeIDfu+/rLWmFXPzaGJATWJPztN9
5giYHKjRTd27FNnGX+gx1grgbvy0MRz2/sYBfFlRJbvefDE2znENe9Egdl6HCxwQ
7N0/UmhzoMe5Qk18zpuWzI3H2BjBn3QkJvnoYKzAz2hqbVXhWNSc02IDR3CQW47h
LVDZ5WWagQ4eqxfE/qRrZL9UmSWrp1tyeJmfqQa2MRoS7BpNrHTOqZ37KyTkQNYZ
JeLOSGioeeGAaHSlE7wEf8ePnpy2FT5oNWCLhSjhoCnDSMxKYPiF2OiUWiww+CYK
YH04qLrHIHQBIlFz+JnnKY7dIVsCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUGM2+oWBqH7guXGYdAKBcganh9oQwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQAQ1gsnJ4CKbLFsab6zZpeZtOsV5K3X2APg/86XmXdm
ILAU0SmzjOpnfhXQCUvESiP6t7Ae/yGWtGwF7sEknccV5qJM0qzJEJhxbsKa9UCr
k7nRCRK0vJsmB50rE5uVa4rpJn3QwhOZVZ1Ra8hkIPNQbIH9UlGZS0Sv7Z4dN8Xn
qaliGbAqRq/qavuvyA1QEb7ECZ0h0ndVewRmlc3uXjWzs75ozcRPFkjtJnarmn/6
Jl/Zn4F97IW8UwnjmuILTQM6FbS+FmLcVkEVWdVWGauYLEtneI8xWDi7+Eu+ymAN
IXiOXbzJ6H8nmtF98mPOSpNuywG7rdaVOyIQSmczjRYx
-----END CERTIFICATE-----'

const logger = createLogger('auth')
const jsonwebtoken = require('jsonwebtoken');

const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

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
    logger.error('User not authorized', { error: e.message })

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
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

    try {
    const verifiedToken = jsonwebtoken.verify(token, certificate, options: {algorithms: ['RS256']});
    return verifiedToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    return undefined;
  }
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}