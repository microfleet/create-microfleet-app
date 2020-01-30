const { Microfleet, ConnectorsTypes } = require('@microfleet/core')
const path = require('path')
const merge = require('lodash/merge')
const conf = require('ms-conf')

conf.prependDefaultConfiguration(path.resolve(__dirname, './config.js'))
const config = conf.get('/', { env: process.env.NODE_ENV })

class DemoApp extends Microfleet {
  constructor(opts = {}) {
    super(merge({}, config, opts))

    // add migration connector
    this.addConnector(ConnectorsTypes.migration, async () => {
      await this.migrate('knex')
    }, 'knex-migration')

    this.addConnector(ConnectorsTypes.migration, async () => {
      await this.migrate('redis', path.resolve(`${__dirname}/../migrations/redis`))
    }, 'redis-migration')
  }
}

module.exports = DemoApp
