const { ActionTransport } = require('@microfleet/core')

async function helloWorldAction(req) {
  return { processed: req.params, time: new Date() }
}

helloWorldAction.transports = [ActionTransport.amqp]

module.exports = helloWorldAction
