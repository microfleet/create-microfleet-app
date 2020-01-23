module.exports = {
  amqp: {
    transport: {
      connection: {
        host: 'amqp',
        port: 5672,
      },
    },
  },
  knex: {
    debug: false,
    client: 'pg',
    connection: {
      host: 'postgres',
      port: 5432,
      user: 'postgres',
      password: 'mysecretpassword',
      database: 'postgres',
    },
  },
}
