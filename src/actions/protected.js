const { ActionTransport } = require('@microfleet/core');

function ProtectedAction() {
  return 'Hello, world by authentificate user!\n';
}

ProtectedAction.auth = {
  name: 'demoStrategy',
  strategy: 'required',
  passAuthError: true,
};
ProtectedAction.transports = [ActionTransport.http];

module.exports = ProtectedAction;
