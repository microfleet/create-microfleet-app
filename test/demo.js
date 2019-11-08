const assert = require('assert')
const rp = require('request-promise')
const DemoApp = require('../src')

describe('server', () => {
  it('should be able to start', async () => {
    const demoApp = new DemoApp()
    await demoApp.connect()
    await demoApp.close()
  })

  it('should say hello world', async () => {
    const demoApp = new DemoApp()
    await demoApp.connect()

    try {
      const response = await rp({
        uri: 'http://0.0.0.0:3000/demo',
      })
      assert.strictEqual(response, 'Hello, world!\n')
    } finally {
      await demoApp.close()
    }
  })
})
