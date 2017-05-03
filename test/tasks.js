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
        'clean',
        'jshint',
        'jscs',
        'mocha',
        'autoprefixer',
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
      assert.fileContent('Gruntfile.js', 'grunt-assemble-permalinks');
    });

    it('should include i18n configuration', function() {
      assert.fileContent('Gruntfile.js', 'grunt-assemble-i18n');
    });

    it('should include Handlebars helpers', function() {
      assert.fileContent('Gruntfile.js', 'handlebars-helper-i18n');
      assert.fileContent('Gruntfile.js', 'handlebars-helper-rawinclude');
    });
  });

  context('with Modernizr feature', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../app'))
        .withArguments(['webapp'])
        .withPrompts({features: ['includeModernizr']})
        .on('end', done);
    });

    it('should include subtask', function() {
      [
        'modernizr'
      ].forEach(function(task) {
        assert.fileContent('Gruntfile.js', task + ': ');
      });
    });
  });

  context('with Sass feature', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../app'))
        .withArguments(['webapp'])
        .withPrompts({features: ['includeSass']})
        .on('end', done);
    });

    it('should include subtask', function() {
      [
        'sass'
      ].forEach(function(task) {
        assert.fileContent('Gruntfile.js', task + ': ');
      });
    });
  });

});
