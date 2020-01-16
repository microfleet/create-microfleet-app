const { ActionTransport } = require('@microfleet/core')
const Errors = require('common-errors')
const { demo } = require('./auth')

module.exports = {
  name: 'demo-app',
  router: {
    extensions: { register: [] },
    routes: {
      transports: [ActionTransport.amqp, ActionTransport.http],
      prefix: 'demo-app',
    },
    auth: {
      strategies: { demo },
    },
  },
  validator: {
    schemas: ['../schemas'],
  },
  plugins: [
    'logger',
    'validator',
    'knex',
    'http',
    'router',
    'amqp',
  ],
  app: {
    someSecret: {
      $filter: 'env',
      // we expect that production value would be passed in the production env so we leave it undefined
      test: 'i-am-NOT-a-secret',
    },
  },
  knex: {
    debug: false,
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'mysecretpassword',
      database: 'postgres',
    },
  },
  amqp: {
    transport: {
      connection: {
        host: 'localhost',
        port: 5672,
      },
      // retry config
      neck: 10,
      bindPersistantQueueToHeadersExchange: true,
      queue: 'my-queue-123',
    },
    retry: {
      enabled: true,
      min: 100,
      max: 30 * 60 * 1000,
      factor: 1.2,
      maxRetries: 3,
      predicate(error, actionName) {
        if (actionName === 'demo-app.amqp.consumer') {
          if (error instanceof Errors.TimeoutError) {
            // we should retry sending message
            return false
          }
        }
        // abort retry
        return true
      },
    },
    router: {
      enabled: true,
      prefix: 'demo-app2',
    },
  },
}
