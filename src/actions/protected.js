const { ActionTransport } = require('@microfleet/core')

function protectedAction(request) {
  const { user } = request.auth.credentials
  return `Hello, world by ${user.name}!`
}

protectedAction.auth = {
  name: 'demo',
}
protectedAction.transports = [ActionTransport.http]

module.exports = protectedAction
