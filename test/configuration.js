const assert = require('assert')
const rp = require('request-promise')
const DemoApp = require('../src')

describe('configuration', () => {
  it('should load configuration from env', async () => {
    const demoApp = new DemoApp()
    await demoApp.connect()

    try {
      const response = await rp({
        uri: 'http://0.0.0.0:3000/configuration',
        json: true,
      })

      assert.strictEqual(response.name, 'demo-app')
      assert.strictEqual(response.app.someSecret, 'i-am-NOT-a-secret')
      assert.deepStrictEqual(response.app.someEnvDependentValues, { replyTo: 'info-production@demo.com' })
    } finally {
      await demoApp.close()
    }
  })
})
