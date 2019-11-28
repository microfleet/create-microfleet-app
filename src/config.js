const { demo } = require('./auth')
const { FileLogger } = require('./logger')

module.exports = {
  name: 'demo-app',
  router: {
    extensions: { register: [] },
    auth: {
      strategies: { demo },
    },
  },
  validator: {
    schemas: ['../schemas'],
  },
  logger: {
    defaultLogger: {
      $filter: 'env',
      test: new FileLogger('info')
    }
  },
  app: {
    someSecret: {
      $filter: 'env',
      // we expect that production value would be passed in the production env so we leave it undefined
      test: 'i-am-NOT-a-secret',
    },
  },
}
