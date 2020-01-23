const { ActionTransport } = require('@microfleet/core')

async function addTodo(request) {
  const { todo } = request.params
  const { knex } = this

  const [newTodoId] = await knex.insert(todo, 'id').into('todos')

  return { todoId: newTodoId }
}

addTodo.transports = [ActionTransport.http]
addTodo.schema = 'validation.schema'
module.exports = addTodo
