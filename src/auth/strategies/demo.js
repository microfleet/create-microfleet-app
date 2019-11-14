const { HttpStatusError } = require('common-errors')

const { REQUIRED_STRATEGY } = require('../../constants')

const users = {
  1: {
    id: 1,
    name: 'Demo User',
  },
}

function verifyToken(authType, token) {
  if (authType !== 'Bearer') {
    throw new HttpStatusError(403, 'Invalid auth type')
  }

  const [body, userId] = token.split(':', 2)

  if (body !== 'demo' || !userId) {
    throw new HttpStatusError(403, 'Malformed Token')
  }

  return userId
}

function demo(request) {
  const { action } = request
  const { auth } = action
  const { strategy = REQUIRED_STRATEGY } = auth
  const { authorization } = request.headers

  if (strategy === REQUIRED_STRATEGY && !authorization) {
    throw new HttpStatusError(401, 'Credentials Required')
  }

  const [authType, token] = authorization.split(/\s+/, 2) // Authorization: Bearer [token]

  if (!auth || !token) {
    throw new HttpStatusError(403, 'Invalid Token')
  }

  const userId = verifyToken(authType, token)
  const user = users[userId]

  if (!user) {
    throw new HttpStatusError(401, "You don't have permission to access")
  }

  return { user }
}

module.exports = demo
