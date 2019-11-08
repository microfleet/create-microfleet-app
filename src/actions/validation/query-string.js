const { ActionTransport } = require('@microfleet/core')

function respondOk(request) {
  return { query : request.query}
}

respondOk.transports = [ActionTransport.http]
respondOk.transportsOptions = {
  [ActionTransport.http]: {
    methods: ['get'],
  },
}
respondOk.transformQuery = (query) => {
  query.page *= 1

  switch (query.hidden) {
    case 'true':
    case '1':
      query.hidden = true
      break

    case 'false':
    case '0':
      query.hidden = false
      break
    default:
      query.hidden = null
  }
  return query
}

respondOk.schema = 'validation.query-string'

module.exports = respondOk
