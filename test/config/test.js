module.exports = {
  amqp: {
    transport: {
      connection: {
        host: 'amqp',
        port: 5672,
      },
    },
  },
  redis: {
    hosts: Array.from({ length: 5 }).map((_, i) => ({
      host: 'redis',
      port: 7000 + i,
    })),
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
