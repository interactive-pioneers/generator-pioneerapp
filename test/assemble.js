'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('Assemble feature', function() {

  var templates = [
    'src/templates/layouts/default.hbs',
    'src/templates/pages/index.hbs',
    'src/templates/partials/header.hbs',
    'src/templates/partials/footer.hbs'
  ];

  describe('on', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../app'))
        .withArguments(['webapp'])
        .withPrompts({features: [
          'includeAssemble'
        ]})
        .on('end', done);
    });

    it('should add dependencies', function() {
      assert.fileContent('package.json', '"assemble"');
      assert.fileContent('package.json', '"assemble-middleware-permalinks"');
    });

    it('should create Handlebars templates', function() {
      assert.file(templates);
    });

    it('should create configuration YAML', function() {
      assert.file('src/data/config.yml');
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
      assert.noFileContent('package.json', '"assemble"');
      assert.noFileContent('package.json', '"assemble-middleware-permalinks"');
    });

    it('shouldn\'t create Handlebars templates', function() {
      assert.noFile(templates);
    });

    it('shouldn\'t create configuration YAML', function() {
      assert.noFile('src/data/config.yml');
    });
  });
});
