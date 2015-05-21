var Promise = require('promise');
var assert = require('chai').assert;
var sinon = require('sinon');
var rewire = require('rewire');
var executeCli = rewire('../../execute-cli');

describe('executeCli', function() {

  var meowStub = sinon.stub();
  meowStub.returns({
    input: ['firstArg']
  });
  executeCli.__set__('meow', meowStub);

  var packageStub = sinon.stub();
  packageStub.returns(Promise.resolve({
    result: 'result'
  }));
  executeCli.__set__('markdownTestfileToJson', packageStub);

  var consoleStub = {
    error: sinon.stub(),
    log: sinon.stub()
  };
  executeCli.__set__('console', consoleStub);

  afterEach(function() {
    consoleStub.log.reset();
    consoleStub.error.reset();
  });

  it('should define a help message', function() {
    return executeCli().then(function() {
      sinon.assert.calledWith(meowStub, {
        help: 'Usage\n' +
          '  markdown-testfile-to-json <inputFile>\n\n' +
          'Example\n' +
          '  markdown-testfile-to-json tests.md'
      });
    });
  });

  it('should send the first argument to the main package', function() {
    return executeCli().then(function() {
      sinon.assert.calledWith(packageStub, 'firstArg');
    });
  });

  it('should output the json if everything went well', function() {
    return executeCli().then(function() {
      sinon.assert.calledWith(consoleStub.log, '{"result":"result"}');
    });
  });

  it('should output the errors if something went wrong', function() {
    packageStub.returns(Promise.reject(['error1', 'error2']));
    return executeCli().then(function() {
      sinon.assert.calledTwice(consoleStub.error);
      sinon.assert.calledWith(consoleStub.error, 'error1');
      sinon.assert.calledWith(consoleStub.error, 'error2');
    });
  });

  it('should support one single error rejected by the promise', function() {
    packageStub.returns(Promise.reject('error'));
    return executeCli().then(function() {
      sinon.assert.calledWith(consoleStub.error, 'error');
    });
  });

  describe('_ensureArray', function() {
    var _ensureArray = executeCli.__get__('_ensureArray');

    it('should put and return an array around what is passed', function() {
      var object = {
        foo: 'bar'
      };
      assert.deepEqual(_ensureArray(object), [object]);
    });

    it('should return the array unchanged if an array is passed', function() {
      var array = ['foo'];
      assert.deepEqual(_ensureArray(array), array);
    });
  });
});