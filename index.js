const { Microfleet, ActionTransport } = require('@microfleet/core');
const path = require('path');

class DemoApp extends Microfleet {
 constructor() {
   super({
     name: 'demo-app',
     router: {
       routes: {
         directory: path.resolve(__dirname, './actions'),
         transports: [ActionTransport.http],
       },
     },
     http: {
       server: {
         handler: 'hapi',
       },
       router: {
         enabled: true,
         prefix: '',
       },
     },
   });
 }
}

module.exports = DemoApp;
