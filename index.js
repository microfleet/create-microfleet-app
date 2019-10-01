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
       extensions: { register: [] },
     },
     http: {
       server: {
         handler: 'hapi',
       },
       router: {
         enabled: true,
       },
     },
   });
 }
}

module.exports = DemoApp;
