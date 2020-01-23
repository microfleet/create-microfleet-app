const { ActionTransport } = require('@microfleet/core')

async function publishAction() {
  const { amqp } = this
  const pwResult = await amqp.publishAndWait('amqp.consumer', { hello: 'world wait' })

  return {
    pwResult,
  }
}

publishAction.transports = [ActionTransport.http]

module.exports = publishAction
