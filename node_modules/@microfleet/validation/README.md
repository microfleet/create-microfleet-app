# Microfleet Validation Module

[![Build Status](https://semaphoreci.com/api/v1/microfleet/validation/branches/master/badge.svg)](https://semaphoreci.com/microfleet/validation)

This is basically a wrapper of [ajv](https://github.com/epoberezkin/ajv) module.
What it does - is accepts a directory with schemas, reads it in an async or sync fashion based on your preference
and caches validators under it's name, minus it's extension (to be completely honest - it strips down `.json` only).
Based on the bluebird promises.

## Installation

`yarn add @microfleet/validation`

## Usage

```ts
// Lets assume that we have a following file structure:
//
// .
// ./schemas/config.json
// ./schemas/ping.json
// ./index.js
//

import Errors = require('common-errors');
import Validator, { HttpStatusError } from '@microfleet/validation';
const validator = new Validator('./schemas');

// some logic here
validator.validate('config', {
  configuration: 'string'
})
.then(doc => {
  // all good
  // handle doc, which would eq { configuration: 'string' }
})
.catch(HttpStatusError, (error) => {
  // handle error here
});

const result = validator.validateSync('config', { data: true });
if (result.error) {
  // handle error!
}

// do stuff
// ...

// init filter
validator.init('./dir', null, true); // all schemas in this dir will filter out additional properties instead of throwing an error

// catches when we only have 417 errors
validator.filter('config', { conf: 'string', extra: true })
  .then(result => {
    //  { conf: 'string' }
  });
```
