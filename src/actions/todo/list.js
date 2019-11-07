const { ActionTransport } = require('@microfleet/core');

function listTodo(request) {
  return { query : request.query};
}

listTodo.transports = [ActionTransport.http];
listTodo.transportsOptions = {
  [ActionTransport.http]: {
    methods: ['get'],
  },
};
listTodo.transformQuery = (query) => {
  query.page *= 1;

  switch (query.hidden) {
    case 'true':
    case '1':
      query.hidden = true;
      break;

    case 'false':
    case '0':
      query.hidden = false;
      break;
    default:
      query.hidden = null;
  }
  return query;
};

listTodo.schema = 'todo.list';

module.exports = listTodo;
