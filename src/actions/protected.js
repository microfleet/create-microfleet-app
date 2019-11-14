const { ActionTransport } = require('@microfleet/core')

const { REQUIRED_STRATEGY } = require('../constants')

function protectedAction(request) {
  const { user } = request.auth.credentials
  return `Hello, world by ${user.name}!`;
}

protectedAction.auth = {
  name: 'demoStrategy',
  strategy: REQUIRED_STRATEGY,
  passAuthError: true,
};
protectedAction.transports = [ActionTransport.http];

module.exports = protectedAction;
