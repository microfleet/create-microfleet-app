const { ActionTransport } = require('@microfleet/core')

// async function publishAction() {
//   const { amqp } = this;
//   //const pResult = await amqp.publish('demo-app.amqp.consumer', { hello: 'world' })
//
//   try {
//     const pwResult = await amqp.publishAndWait('demo-app.amqp.consumer', { hello: 'world wait' })
//     return {
//       pwResult
//     }
//   } catch (e) {
//     return {
//       unableToPulbish: true,
//       e
//     }
//   }
//   // const sResult = await amqp.send('test-queue', { hello: 'world queue' })
//   // const swResult = await amqp.sendAndWait('test-queue', { hello: 'world' })
//   // return {
//   //   pwResult, //pResult,
//   //   // sResult, swResult
//   // }
// }

async function publishAction() {
  const { amqp } = this;
  const pResult = await amqp.publish('demo-app2.demo-app.amqp.consumer', { hello: 'world' })
  const pwResult = await amqp.publishAndWait('demo-app2.demo-app.amqp.consumer', { hello: 'world wait' })

  return {
    pwResult,
    pResult,
  }
}

publishAction.transports = [ActionTransport.http]

module.exports = publishAction
