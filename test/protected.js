const assert = require('assert');
const rp = require('request-promise');
const DemoApp = require('../src');

describe('Server process protected action:', () => {
  const demoApp = new DemoApp();

  before(() => demoApp.connect());
  after(() => demoApp.close());

  it('allow with valid credentials', async () => {
    const response = await rp({
      uri: 'http://0.0.0.0:3000/protected',
      headers: {
        authorization: `Bearer some-valid-token`
      }
    });

    assert(response);
  });

  it('reject without credentials', async () => {
    const request = rp({
      uri: 'http://0.0.0.0:3000/protected',
    });

    await assert.rejects(request, 'Credentials Required');
  });

  it('reject with invalid credentials', async () => {
    const request = rp({
      uri: 'http://0.0.0.0:3000/protected',
      headers: {
        authorization: `invalid-token`
      }
    });

    await assert.rejects(request, 'Invalid Token');
  });
});
