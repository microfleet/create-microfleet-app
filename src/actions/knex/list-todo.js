const { ActionTransport } = require('@microfleet/core')

async function listTodo() {
  const { knex } = this

  const todos = await knex.select().from('todos')

  return { todos }
}

listTodo.transports = [ActionTransport.http]

module.exports = listTodo
