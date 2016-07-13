'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('CofeeScript feature', function() {

  var coffeescripts = [
    'app/scripts/main.coffee',
    'app/scripts/debug.coffee',
    'app/scripts/ie.coffee'
  ];

  var javascripts = [
    'app/scripts/main.js',
    'app/scripts/ie.js',
    'app/scripts/debug.js'
  ];

  describe('on', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../app'))
        .withArguments(['webapp'])
        .withPrompts({features: []})
        .withOptions({'coffee': true})
        .on('end', done);
    });

    it('should add dependencies', function() {
      assert.fileContent('package.json', '"grunt-contrib-coffee"');
    });

    it('should create CoffeeScript files', function() {
      assert.file(coffeescripts);
    });

    it('shouldn\'t create JavaScript files', function() {
      assert.noFile(javascripts);
    });
  });

  describe('off', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../app'))
        .withArguments(['webapp'])
        .withPrompts({features: []})
        .on('end', done);
    });

    it('shouldn\'t add dependencies', function() {
      assert.noFileContent('package.json', '"grunt-contrib-coffee"');
    });

    it('shouldn\'t create CoffeeScript files', function() {
      assert.noFile(coffeescripts);
    });

    it('should create JavaScript files', function() {
      assert.file(javascripts);
    });
  });
});
