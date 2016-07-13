'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('Assemble i18n feature', function() {

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
          'includeAssembleI18N'
        ]})
        .on('end', done);
    });

    it('should add dependencies', function() {
      assert.fileContent('package.json', '"grunt-assemble-i18n');
    });

    it('should create Handlebars template', function() {
      assert.file('src/templates/pages/home/index.hbs');
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
      assert.noFileContent('package.json', '"grunt-assemble-i18n');
    });

    it('shouldn\'t create Handlebars templates', function() {
      assert.noFile('src/templates/pages/home/index.hbs');
    });

    it('shouldn\'t create configuration YAMLs', function() {
      assert.noFile(configs);
    });
  });
});
