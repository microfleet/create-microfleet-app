const { ActionTransport } = require('@microfleet/core')

async function deleteTodo(request) {
  const { id } = request.params
  const { knex } = this

  const deleted = await knex('todos').where('id', id).delete()
  return { deleted }
}

deleteTodo.transports = [ActionTransport.http]
module.exports = deleteTodo
