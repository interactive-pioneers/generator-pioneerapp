'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('Grunt tasks', function() {

  context('with default features', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../app'))
        .withArguments(['webapp'])
        .withPrompts({features: []})
        .on('end', done);
    });

    it('should include CLI tasks', function() {
      [
        'build',
        'qa',
        'serve',
        'server',
        'test',
        'default'
      ].forEach(function(task) {
        assert.fileContent('Gruntfile.js', 'grunt.registerTask(\'' + task);
      });
    });

    it('should include subtasks', function() {
      [
        'watch',
        'connect',
        'clean',
        'jshint',
        'jscs',
        'mocha',
        'autoprefixer',
        'wiredep',
        'rev',
        'useminPrepare',
        'usemin',
        'imagemin',
        'svgmin',
        'htmlmin',
        'copy',
        'concurrent',
        'browserSync',
        'pngcheck'
      ].forEach(function(task) {
        assert.fileContent('Gruntfile.js', task + ': ');
      });
    });
  });

  context('with Assemble feature', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../app'))
        .withArguments(['webapp'])
        .withPrompts({features: ['includeAssemble']})
        .on('end', done);
    });

    it('should include subtasks', function() {
      [
        'assemble'
      ].forEach(function(task) {
        assert.fileContent('Gruntfile.js', task + ': ');
      });
    });

    it('should include permalinks configuration', function() {
      assert.fileContent('Gruntfile.js', 'assemble-middleware-permalinks');
    });

    it('shouldn\'t include i18n configuration', function() {
      assert.noFileContent('Gruntfile.js', 'grunt-assemble-i18n');
    });
  });

  context('with Assemble i18n feature', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../app'))
        .withArguments(['webapp'])
        .withPrompts({features: ['includeAssembleI18N']})
        .on('end', done);
    });

    it('should include subtasks', function() {
      [
        'assemble'
      ].forEach(function(task) {
        assert.fileContent('Gruntfile.js', task + ': ');
      });
    });

    it('should include i18n configuration', function() {
      assert.fileContent('Gruntfile.js', 'grunt-assemble-i18n');
    });
  });
});
