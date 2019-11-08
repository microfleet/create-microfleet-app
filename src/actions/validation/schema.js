const { ActionTransport } = require('@microfleet/core')

function respondOk(request) {
  const { todo } = request.params
  return { ok: { todo }}
}

respondOk.transports = [ActionTransport.http]
respondOk.schema = 'validation.schema'
module.exports = respondOk
