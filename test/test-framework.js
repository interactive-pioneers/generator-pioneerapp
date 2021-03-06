'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('test framework', function() {
  describe('mocha', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../app'))
        .withArguments(['webapp'])
        .withOptions({'test-framework': 'mocha'})
        .withPrompts({features: []})
        .on('end', done);
    });

    it('generates the expected fixture', function() {
      assert.fileContent('test/index.html', 'mocha');
    });
  });

});
