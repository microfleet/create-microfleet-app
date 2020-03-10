const assert = require('assert')
const rp = require('request-promise')
const DemoApp = require('../../src')

describe('#amqp action test', () => {
  const query = rp.defaults({
    baseUrl: 'http://0.0.0.0:3000/amqp',
    method: 'POST',
    json: true,
  })

  before(async () => {
    this.demoapp = new DemoApp()
    await this.demoapp.connect()
  })

  after(async () => {
    await this.demoapp.close()
  })

  it('connects to amqp broker', async () => {
    const { amqp } = this.demoapp
    assert.ok(amqp, 'should have AMQP plugin')
    assert(amqp._amqp.state === 'open', 'should have connection open')
  })

  it('should able to call hello-world action using amqp', async () => {
    const { amqp } = this.demoapp
    const response = await amqp.publishAndWait('amqp.hello-world', { testParam: 1 })
    assert.deepEqual(response.processed, { testParam: 1 })
  })

  it('should able to call other amqp actions using http endpoint', async () => {
    const { pwResult } = await query({
      url: 'publish',
      data: {},
    })

    assert(pwResult.retryCount === 3)
    assert.deepStrictEqual(pwResult.processed, { hello: 'world wait' })
  })

  it('should receive response when retry attempts enabled and something goes wrong', async () => {
    const { amqp } = this.demoapp
    const response = await amqp.publishAndWait('amqp.consumer', { testParam: 42 })
    assert.deepEqual(response.processed, { testParam: 42 })
  })

  it('throws an error if retry attempt count limit reached', async () => {
    const { amqp } = this.demoapp
    const response = amqp.publishAndWait('amqp.consumer', { maxAttempts: 6 })
    await assert.rejects(response, {
      message: 'Timeout of \'100ms\' exceeded',
      name: 'TimeoutError',
    })
  })
})
