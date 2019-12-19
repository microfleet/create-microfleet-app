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
    // if (config.migrations.enabled === true) {
    this.addConnector(ConnectorsTypes.migration, () => (
      this.migrate('knex', `${__dirname}/migrations`)
    ), 'knex-migration')
    // }
  }
}

module.exports = DemoApp
