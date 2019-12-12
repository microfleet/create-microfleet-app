const { ActionTransport } = require('@microfleet/core')
const Errors = require('common-errors');

async function consumerAction(req) {
  const { headers } = req.headers;
  const retryCount = headers['x-retry-count'] || 0;
  if (retryCount < 2) {
    throw new Errors.TimeoutError(`100ms`);
  }
  return { processed: req.params, time: new Date() }
}

consumerAction.transports = [ActionTransport.amqp]

module.exports = consumerAction
