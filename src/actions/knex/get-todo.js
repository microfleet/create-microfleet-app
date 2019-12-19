const { ActionTransport } = require('@microfleet/core')
const Errors = require('common-errors')

async function getTodo(request) {
  const { knex } = this
  const { id } = request.params

  const todo = await knex.select('*').from('todos').where('id', id).first()

  if (todo === undefined) {
    throw new Errors.NotFoundError('No such todo!')
  }

  return { todo }
}

getTodo.transports = [ActionTransport.http]

module.exports = getTodo
