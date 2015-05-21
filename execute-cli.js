'use strict';

var meow = require('meow');
var markdownTestfileToJson = require('./');

function execute() {
  var cli = meow({
    help: [
      'Usage',
      '  markdown-testfile-to-json <inputFile>',
      '',
      'Example',
      '  markdown-testfile-to-json tests.md'
    ].join('\n')
  });

  return markdownTestfileToJson(cli.input[0])
    .then(function(json) {
      console.log(JSON.stringify(json));
    })
    .catch(function(errors) {
      errors = _ensureArray(errors);
      errors.forEach(function(error) {
        console.error(error.toString());
      });
    });
}

function _ensureArray(candidate) {
  return (candidate instanceof Array) ? candidate : [candidate];
}

module.exports = execute;