const { ActionTransport } = require('@microfleet/core')

function demoAction() {
  return 'Hello, world!\n'
}

demoAction.transports = [ActionTransport.http]

module.exports = demoAction
