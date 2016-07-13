'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('Sass feature', function() {
  describe('on', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../app'))
        .withArguments(['webapp'])
        .withPrompts({features: [
          'includeSass'
        ]})
        .on('end', done);
    });

    it('should add dependencies', function() {
      assert.fileContent('package.json', '"grunt-sass"');
      assert.fileContent('package.json', '"grunt-scss-lint"');
    });

    it('should create SCSS file', function() {
      assert.file('app/styles/main.scss');
    });

    it('should create SCSS linting configuration', function() {
      assert.file('.scss-lint.yml');
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
      assert.noFileContent('package.json', '"grunt-sass"');
      assert.noFileContent('package.json', '"grunt-scss-lint"');
    });

    it('should create CSS file', function() {
      assert.file('app/styles/main.css');
    });

    it('shouldn\'t create SCSS linting configuration', function() {
      assert.noFile('.scss-lint.yml');
    });
  });
});
