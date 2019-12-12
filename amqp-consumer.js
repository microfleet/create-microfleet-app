const AmqpTransport = require('@microfleet/transport-amqp');

(async () => {
  const opts = {
    cache: 100,
    exchange: '',
    queue: 'test-queue',
  }

  const amqp = await AmqpTransport.connect(opts, (message, properties, actions, callback) => {
    console.debug(`AMQPMessage[${Date.now()}]` ,  message, properties);
      return callback(null, {
        response: typeof message === 'object' ? message : `${message}-response`,
        time: process.hrtime(),
      })
    })
})()


