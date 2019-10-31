const { Microfleet } = require('@microfleet/core')
const path = require('path')
const merge = require('lodash/merge')
const confidence = require('ms-conf')

confidence.prependDefaultConfiguration(path.resolve(__dirname, './config.js'))
const config = confidence.get('/', { env: process.env.NODE_ENV })

class DemoApp extends Microfleet {
  constructor(opts = {}) {
    super(merge({}, config, opts))
  }
}

module.exports = DemoApp;
