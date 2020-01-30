const assert = require('assert')
const rp = require('request-promise')
const DemoApp = require('../../src')

describe('#knex connection', () => {
  before(async () => {
    this.demoapp = new DemoApp()
    await this.demoapp.connect()
  })

  after(async () => {
    await this.demoapp.close()
  })

  it('connects to database', async () => {
    const { knex } = this.demoapp
    assert.ok(knex, 'should have Knex plugin')

    const result = await knex.raw('select true;')
    assert(result, 'should able to query database')
  })

  describe('CRUD', () => {
    const query = rp.defaults({
      baseUrl: 'http://0.0.0.0:3000/knex',
      method: 'POST',
      json: true,
    })

    const createTodo = async (todo) => {
      const { todoId } = await query({
        url: 'add-todo',
        body: { todo },
      })
      return todoId
    }

    const todoData = {
      name: 'myTodo',
      description: 'my description',
      state: true,
      extradata: null,
    }

    afterEach(async () => {
      await this.demoapp.knex('todos').truncate()
    })

    it('create', async () => {
      const todoId = await createTodo(todoData)
      assert(todoId > 0, 'returns new id')
    })

    it('get', async () => {
      const newTodoId = await createTodo(todoData)
      const { todo: { id, created, ...todo } } = await query({
        url: 'get-todo',
        body: { id: newTodoId },
      })

      assert.deepStrictEqual(todo, todoData, 'retrieves todo')
    })

    it('list', async () => {
      await createTodo(todoData)
      await createTodo({ ...todoData, name: 'second todo' })

      const { todos } = await query({
        url: 'list-todo',
      })
      assert(todos.length === 2, 'retrieves list of todos')
    })

    it('update', async () => {
      const updatedTodoData = {
        name: 'myTodo-renamed',
        description: 'my description',
        state: false,
        extradata: 'foo',
      }

      const todoId = await createTodo(todoData)
      const { todo } = await query({
        url: 'update-todo',
        body: {
          todo: { ...updatedTodoData, id: todoId },
        },
      })

      const { id, created, ...dataToCheck } = todo
      assert.deepStrictEqual(updatedTodoData, dataToCheck, 'updates todo')
    })

    it('delete', async () => {
      const newTodoId = await createTodo(todoData)

      await query({
        url: 'delete-todo',
        body: { id: newTodoId },
      })

      const getTodoRequest = query({
        url: 'get-todo',
        body: { id: newTodoId },
      })

      await assert.rejects(getTodoRequest, { statusCode: 404 }, 'should throw error')
    })
  })
})
