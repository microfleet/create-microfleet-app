const { ActionTransport } = require('@microfleet/core');

function protectedAction() {
  return 'Hello, world by authentificated user!\n';
}

protectedAction.auth = {
  name: 'demoStrategy',
  strategy: 'required',
  passAuthError: true,
};
protectedAction.transports = [ActionTransport.http];

module.exports = protectedAction;
