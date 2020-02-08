exports.up = function todoTableAlter(knex) {
  return knex.schema
    .alterTable('todos', (table) => {
      table.string('description', 255).alter()
      table.boolean('state').defaultTo(true).alter()
      table.string('extradata', 255)
    })
}

exports.down = function todoTableDelete(knex) {
  return knex.schema
    .alterTable('todos', (table) => {
      table.string('description', 255).notNullable().alter()
      table.boolean('state').defaultTo(false).alter()
      table.dropColumn('extradata')
    })
}

exports.config = { transaction: false }
