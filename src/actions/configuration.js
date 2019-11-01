const { ActionTransport } = require('@microfleet/core')

function getConfigurationAction() {
  return JSON.stringify(this.config, null, 2)
}

getConfigurationAction.transports = [ActionTransport.http]

module.exports = getConfigurationAction
