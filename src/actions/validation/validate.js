const { ActionTransport } = require('@microfleet/core');

function validateTodo(request) {
  const { todo } = request.params;
  const validationResult = this
    .validate('objects.todo', todo)
    .then((result) => {
      return { validationResult: result }
    })
    .catch({ name: 'HttpStatusError' }, (e) => {
      return { validationError: e };
    });
  return validationResult;
}

validateTodo.transports = [ActionTransport.http];
module.exports = validateTodo;
