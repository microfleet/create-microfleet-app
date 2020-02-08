exports.up = function todoTableCreate(knex) {
  return knex.schema
    .createTable('todos', (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('description', 255).notNullable()
      table.boolean('state').defaultTo(false)
      table.timestamp('created').defaultTo(knex.fn.now())
    })
}

exports.down = function todoTableDelete(knex) {
  return knex.schema
    .dropTable('todos')
}

exports.config = { transaction: false }
