const { ActionTransport } = require('@microfleet/core')

function loggingAction({ params }) {
  const { log } = this

  log.trace({ params }, 'We may trace info')
  log.debug({ params }, 'We may debug info')
  log.info({ params }, 'We may log info')
  log.warn({ params }, 'We may warn')
  log.error({ params }, 'We may log error')
  // log.fatal({ params }, 'We may log fatal error')

  return {};
}

loggingAction.transports = [ActionTransport.http]

module.exports = loggingAction
