'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('Assemble feature', function() {

  var templates = [
    'src/templates/layouts/default.hbs',
    'src/templates/pages/index.hbs',
    'src/templates/partials/header.hbs',
    'src/templates/partials/footer.hbs',
    'src/templates/partials/facebook.hbs',
    'src/templates/pages/home/index.hbs'
  ];

  var configs = [
    'src/data/i18n/i18n.yml',
    'src/data/i18n/en_GB.yml',
    'src/data/i18n/de_DE.yml',
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
      assert.fileContent('package.json', '"grunt-assemble"');
      assert.fileContent('package.json', '"grunt-assemble-permalinks"');
      assert.fileContent('package.json', '"grunt-assemble-i18n');
      assert.fileContent('package.json', '"handlebars-helper-i18n');
      assert.fileContent('package.json', '"handlebars-helper-rawinclude');
    });

    it('should create Handlebars templates', function() {
      assert.file(templates);
    });

    it('should create configuration YAMLs', function() {
      assert.file(configs);
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
      assert.noFileContent('package.json', '"grunt-assemble"');
      assert.noFileContent('package.json', '"grunt-assemble-permalinks"');
      assert.noFileContent('package.json', '"grunt-assemble-i18n');
      assert.noFileContent('package.json', '"handlebars-helper-i18n');
      assert.noFileContent('package.json', '"handlebars-helper-rawinclude');
    });

    it('shouldn\'t create Handlebars templates', function() {
      assert.noFile(templates);
    });

    it('shouldn\'t create configuration YAMLs', function() {
      assert.noFile(configs);
    });
  });
});
