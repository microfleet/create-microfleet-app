const { Microfleet, ActionTransport } = require('@microfleet/core');
const path = require('path');

class DemoApp extends Microfleet {
 constructor() {
   super({
     name: 'demo-app',
     router: {
       extensions: { register: [] },
     },
   });
 }
}

module.exports = DemoApp;
