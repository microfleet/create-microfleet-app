const assert = require('assert')
const DemoApp = require('../../src')

describe('#amqp action test', () => {
  before(async () => {
    this.demoapp = new DemoApp()
    await this.demoapp.connect()
  })

  after(async () => {
    await this.demoapp.close()
  })

  it('connects to redis server', async () => {
    const { redis } = this.demoapp
    assert.ok(redis, 'should have AMQP plugin')
  })

  it('should able to call redis commands', async () => {
    const { redis } = this.demoapp
    await redis.set('sample-key', 'some-value')
    const keyContents = await redis.get('sample-key')
    assert.strictEqual(keyContents, 'some-value')
  })
})
