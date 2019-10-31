const { HttpStatusError } = require('common-errors');

function verifyToken(token) {
  const validToken = !!token; // check token structure, check token on exist

  if (!validToken) {
    throw new HttpStatusError(403, 'Invalid Token');
  }
}

function demoStrategy(request) {
  const { action } = request;
  const { auth } = action;
  const { strategy = 'required' } = auth;
  const { authorization } = request.headers;

  if (authorization) {
    const [auth, token] = authorization.split(/\s+/, 2); // Authorization: Bearer [token]

    if (!token) {
      throw new HttpStatusError(401, 'Credentials Required');
    }

    return verifyToken(token)
  }

  if (strategy === 'required') {
    throw new HttpStatusError(401, 'Credentials Required');
  }
}

module.exports = demoStrategy;
