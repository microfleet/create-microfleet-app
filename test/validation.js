const assert = require('assert')
const rp = require('request-promise')
const DemoApp = require('../src')

describe('#todo validation', () => {
  before(async () => {
    this.demoapp = new DemoApp()
    await this.demoapp.connect()
  })

  after(async () => {
    await this.demoapp.close()
  })

  describe('query string validation', () => {
    const listTodo = rp.defaults({
      uri: 'http://0.0.0.0:3000/validation/query-string',
      method: 'GET',
      json: true,
    })

    it('throws validation error on incorrect data', async () => {
      const { error } = await listTodo({
        qs: {
          page: 0,
        },
      }).catch((e) => {
        return e
      })

      assert(error.statusCode === 400, 'must throw validation error')
      assert(error.message === 'todo.list validation failed: data.page should be >= 1, data.hidden should be boolean')
    })

    it('performs some work when qs is valid', async () => {
      const qs = {
        page:10,
        hidden: true,
      }
      const response = await listTodo({ qs })

      assert.deepStrictEqual(response.query, qs, 'returns parsed qs as result')
    })
  })

  describe('request body validation', () => {
    const createTodo = rp.defaults({
      uri: 'http://0.0.0.0:3000/validation/schema',
      method: 'POST',
      json: true,
    })

    it('throws validation error on incorrect data', async () => {
      const { error } = await createTodo({
        body: {
          todo: {},
        },
      }).catch((e) => {
        return e
      })

      assert(error.statusCode === 400, 'must throw validation error')
      assert(error.name === 'HttpStatusError')
      assert(error.message === 'todo.create validation failed: data.todo should have required property \'state\', data.todo should have required property \'name\'')
    })

    it('performs some work when data is valid', async () => {
      const todo = {
        name: "myTodo",
        description: "my description",
        state: true,
      }

      const { ok } = await createTodo({
        body: { todo },
      })
      assert.deepStrictEqual(ok.todo, todo, 'returns todo as success result')
    })
  })

  describe('object validation', () => {
    const validateTodo = rp.defaults({
      uri: 'http://0.0.0.0:3000/validation/validate',
      method: 'POST',
      json: true,
    })

    it('returns validation error on incorrect data', async () => {
      const { validationError } = await validateTodo({
        body: {
          todo: {
            name: 'myTodo',
          },
        },
      }).catch((e) => {
        return e
      })

      assert(validationError.name === 'HttpStatusError')
      assert(validationError.message === 'objects.todo validation failed: data should have required property \'state\'')
    })

    it('performs some work when data is valid', async () => {
      const todo = {
        name: "myTodo",
        description: "my description",
        state: true,
      }

      const response = await validateTodo({
        body: { todo },
      })
      assert.deepStrictEqual(response.validationResult, todo, 'returns todo as success result')
    })
  })
})
