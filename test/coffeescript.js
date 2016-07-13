'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('CofeeScript feature', function() {

  var files = [
    'app/scripts/main.coffee',
    'app/scripts/debug.coffee',
    'app/scripts/ie.coffee'
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
      assert.file(files);
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
      assert.noFile(files);
    });
  });
});
