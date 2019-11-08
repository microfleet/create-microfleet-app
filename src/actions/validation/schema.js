const { ActionTransport } = require('@microfleet/core')

function createTodo(request) {
  const { todo } = request.params
  return { ok: { todo }}
}

createTodo.transports = [ActionTransport.http]
createTodo.schema = 'todo.create'
module.exports = createTodo
