const { ActionTransport } = require('@microfleet/core')
const Errors = require('common-errors')

async function consumerAction(req) {
  const { headers } = req.headers
  const { params } = req
  const maxAttempts = params.maxAttempts || 3

  const retryCount = headers['x-retry-count'] || 0
  if (retryCount < maxAttempts) {
    throw new Errors.TimeoutError(`100ms`)
  }
  return { processed: req.params, time: new Date(), retryCount }
}

consumerAction.transports = [ActionTransport.amqp]

module.exports = consumerAction
