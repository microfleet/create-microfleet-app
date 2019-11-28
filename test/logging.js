const assert = require('assert');
const rp = require('request-promise')
const DemoApp = require('../src')

describe('Logging', () => {
  it('logs info', async () => {
    const demoApp = new DemoApp()
    await demoApp.connect();

    try {
      await rp({ uri: 'http://0.0.0.0:3000/logging' })
    } finally {
      await demoApp.close();
    }
  })
})
