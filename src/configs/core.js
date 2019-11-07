const { routerExtension } = require('@microfleet/core');

exports.plugins = [
  'validator',
  'logger',
  'router',
  'http',
];

exports.validator = {
  schemas: ['../schemas'],
};

const qsValidator = routerExtension('validate/query-string-parser');

exports.router = {
  extensions: {
    enabled: [ 'preValidate' ],
    register: [ qsValidator ],
  },
};

exports.logger= {
  defaultLogger: true,
};
