'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('Modernizr feature', function() {


  describe('on', function() {
    context('without Assemble', function() {
      before(function(done) {
        helpers.run(path.join(__dirname, '../app'))
          .withArguments(['webapp'])
          .withPrompts({features: [
            'includeModernizr'
          ]})
          .on('end', done);
      });

      it('should add dependencies', function() {
        assert.fileContent('package.json', '"grunt-modernizr"');
        assert.fileContent('bower.json', '"modernizr"');
      });

      it('should add script tag', function() {
        assert.fileContent('app/index.html', 'modernizr.js');
      });

      it('should add no-js class', function() {
        assert.fileContent('app/index.html', 'class="no-js"');
      });
    });

    context('with Assemble', function() {
      before(function(done) {
        helpers.run(path.join(__dirname, '../app'))
          .withArguments(['webapp'])
          .withPrompts({features: [
            'includeModernizr',
            'includeAssemble'
          ]})
          .on('end', done);
      });

      it('should add dependencies', function() {
        assert.fileContent('package.json', '"grunt-modernizr"');
        assert.fileContent('bower.json', '"modernizr"');
      });

      it('should add script tag', function() {
        assert.fileContent([
          ['app/index.html', 'modernizr.js'],
          ['src/templates/layouts/default.hbs', 'modernizr.js']
        ]);
      });

      it('should add no-js class', function() {
        assert.fileContent([
          ['app/index.html', 'class="no-js"'],
          ['src/templates/layouts/default.hbs', 'class="no-js"']
        ]);
      });
    });
  });

  describe('off', function() {

    context('without Assemble', function() {
      before(function(done) {
        helpers.run(path.join(__dirname, '../app'))
          .withArguments(['webapp'])
          .withPrompts({features: []})
          .on('end', done);
      });

      it('shouldn\'t add dependencies', function() {
        assert.noFileContent('package.json', '"grunt-modernizr"');
        assert.noFileContent('bower.json', '"modernizr"');
      });
    });

    context('with Assemble', function() {
      before(function(done) {
        helpers.run(path.join(__dirname, '../app'))
          .withArguments(['webapp'])
          .withPrompts({features: [
            'includeAssemble'
          ]})
          .on('end', done);
      });

      it('shouldn\'t add script tag', function() {
        assert.noFileContent('src/templates/layouts/default.hbs', 'modernizr.js');
      });

      it('shouldn\'t add no-js class', function() {
        assert.noFileContent('src/templates/layouts/default.hbs', 'class="no-js"');
      });
    });
  });
});
