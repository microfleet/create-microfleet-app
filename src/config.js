const { demo } = require('./auth')

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
  plugins: [
    'logger',
    'validator',
    'knex',
    'http',
    'router',
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
}
