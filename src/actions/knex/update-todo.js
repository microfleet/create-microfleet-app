const { ActionTransport } = require('@microfleet/core')

async function updateTodo(request) {
  const { todo } = request.params
  const { knex } = this

  await knex('todos').update(todo)
  const updatedTodo = await knex('todos').select().where({ id: todo.id }).first()
  return { todo: updatedTodo }
}

updateTodo.transports = [ActionTransport.http]
updateTodo.schema = 'validation.schema'
module.exports = updateTodo
