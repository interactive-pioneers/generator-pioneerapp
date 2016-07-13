'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('general', function() {
  before(function(done) {
    helpers.run(path.join(__dirname, '../app'))
      .withPrompts({features: []})
      .withGenerators([
        [helpers.createDummyGenerator(), 'mocha:app']
      ])
      .withArguments(['webapp'])
      .on('end', done);
  });

  it('the generator can be required without throwing', function() {
    // not testing the actual run of generators yet
    require('../app');
  });

  it('creates expected files', function() {
    assert.file([
      '.editorconfig',
      '.tern-project',
      '.jscsrc',
      '.gitignore',
      '.gitattributes',
      'package.json',
      'bower.json',
      'Gruntfile.js',
      'README.md',
      'app/favicon.ico',
      'app/robots.txt',
      'app/index.html',
      'app/styles/main.css',
      'app/images/layout/.gitkeep',
      'app/images/style/.gitkeep',
      'app/images/temp/.gitkeep',
      'app/images/videos/.gitkeep',
      'app/fonts/.gitkeep'
    ]);
  });
});
