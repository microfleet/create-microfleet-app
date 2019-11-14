const { HttpStatusError } = require('common-errors');

const { REQUIRED_STRATEGY } = require('../../constants')

const users = {
  '1': {
    id: 1,
    name: 'Demo User',
  }
}

function verifyToken(token) {
  const [body, userId] = token.split(':', 2);

  if (body !== 'demo' || !userId) {
    throw new HttpStatusError(403, 'Malformed Token');
  }

  return userId
}

function demoStrategy(request) {
  const { action } = request;
  const { auth } = action;
  const { strategy = REQUIRED_STRATEGY } = auth;
  const { authorization } = request.headers;

  if (authorization) {
    const [auth, token] = authorization.split(/\s+/, 2); // Authorization: Bearer [token]

    if (!auth || !token) {
      throw new HttpStatusError(403, 'Invalid Token');
    }

    const userId = verifyToken(token)
    const user = users[userId]

    if (!user) {
      throw new HttpStatusError(401, "You don't have permission to access");
    }

    return { user }
  }

  if (strategy === REQUIRED_STRATEGY) {
    throw new HttpStatusError(401, 'Credentials Required');
  }
}

module.exports = demoStrategy;
