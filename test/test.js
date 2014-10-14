/*global describe, beforeEach, it*/

var path = require('path');
var assert = require('assert');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var _ = require('underscore');

describe('Webapp generator', function () {
  // not testing the actual run of generators yet
  it('the generator can be required without throwing', function () {
    this.app = require('../app');
  });

  describe('run test', function () {

    var expectedContent = [
      ['bower.json', /"name": "tmp"/],
      ['package.json', /"name": "tmp"/]
    ];
    var expected = [
      '.editorconfig',
      '.gitignore',
      '.gitattributes',
      'package.json',
      'bower.json',
      'Gruntfile.js',
      'app/favicon.ico',
      'app/robots.txt',
      'app/index.html'
    ];
    var assemble = [
      'src/templates/pages/index.hbs',
      'src/data/config.yml',
      'src/templates/layouts/default.hbs',
      'src/templates/partials/header.hbs',
      'src/templates/partials/footer.hbs'
    ];
    var assembleI18N = [
      'src/data/i18n/i18n.yml',
      'src/data/i18n/en_GB.yml',
      'src/data/i18n/de_DE.yml'
    ];

    var options = {
      'skip-install-message': true,
      'skip-install': true,
      'skip-welcome-message': true,
      'skip-message': true
    };

    var runGen;

    beforeEach(function () {
      runGen = helpers
        .run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, '.tmp'))
        .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']]);
    });

    it('creates expected files', function (done) {
      runGen.withOptions(options).on('end', function () {

        assert.file([].concat(
          expected,
          'app/styles/main.css',
          'app/scripts/main.js'
        ));
        assert.noFile([
          'app/styles/main.scss',
          'app/scripts/main.coffee'
        ]);

        assert.fileContent(expectedContent);
        assert.noFileContent([
          ['Gruntfile.js', /coffee/],
          ['Gruntfile.js', /modernizr/],
          ['app/index.html', /modernizr/],
          ['bower.json', /modernizr/],
          ['package.json', /modernizr/],
          ['Gruntfile.js', /bootstrap/],
          ['app/index.html', /bootstrap/],
          ['bower.json', /bootstrap/],
          ['Gruntfile.js', /sass/],
          ['app/index.html', /Sass/],
          ['.gitignore', /\.sass-cache/],
          ['package.json', /grunt-contrib-sass/],
          ['package.json', /grunt-sass/],
          ['Gruntfile.js', /bootstrap-sass-official/],
          ['app/index.html', /Sass is a mature/],
          ['bower.json', /bootstrap-sass-official/]
        ]);
        done();
      });
    });

    it('creates expected CoffeeScript files', function (done) {
      runGen.withOptions(
        _.extend(options, {coffee: true})
      ).on('end', function () {

        assert.file([].concat(
          expected,
          'app/scripts/main.coffee'
        ));
        assert.noFile('app/scripts/main.js');

        assert.fileContent([].concat(
          expectedContent,
          [['Gruntfile.js', /coffee/]]
        ));

        done();
      });
    });

    it('creates expected modernizr components', function (done) {
      runGen.withOptions(options).withPrompt({features: ['includeModernizr']})
      .on('end', function () {

        assert.fileContent([
          ['Gruntfile.js', /modernizr/],
          ['app/index.html', /modernizr/],
          ['bower.json', /modernizr/],
          ['package.json', /modernizr/],
        ]);

        done();
      });
    });

    it('creates expected bootstrap components', function (done) {
      runGen.withOptions(options).withPrompt({features: ['includeBootstrap']})
      .on('end', function () {

        assert.fileContent([
          ['Gruntfile.js', /bootstrap/],
          ['app/index.html', /bootstrap/],
          ['bower.json', /bootstrap/]
        ]);

        done();
      });
    });

    it('creates expected node SASS files', function (done) {
      runGen.withOptions(options).withPrompt({
        features: ['includeSass'],
        libsass: true
      }).on('end', function () {

        assert.fileContent([
          ['package.json', /grunt-sass/]
        ]);

        assert.noFileContent([
          ['package.json', /grunt-contrib-sass/],
          ['Gruntfile.js', /bootstrap-sass-official/]
        ]);

        done();
      });
    });

    it('creates expected SASS and Bootstrap components', function (done) {
      runGen.withOptions(options).withPrompt({
        features: ['includeSass', 'includeBootstrap']
      }).on('end', function () {

        assert.fileContent([
          ['Gruntfile.js', /bootstrap-sass-official/],
          ['app/index.html', /Sass is a mature/],
          ['bower.json', /bootstrap-sass-official/]
        ]);

        done();
      });
    });

    it('creates expected clean Assemble structure', function (done) {
      runGen.withOptions(options).withPrompt({
        features: ['includeAssemble']
      }).on('end', function () {

        assert.file(assemble);

        assert.fileContent(
          ['Gruntfile.js', /assemble/],
          ['src/templates/pages/index.hbs', /{title}/]
        );

        done();
      });
    });

    it('creates expected i18n-capable Assemble structure', function (done) {
      runGen.withOptions(options).withPrompt({
        features: ['includeAssemble', 'includeI18N']
      }).on('end', function () {

        assert.file([].concat(assemble, assembleI18N));

        assert.fileContent(
          ['Gruntfile.js', /assemble-contrib-i18n/],
          ['Gruntfile.js', /assemble-contrib-permalinks/],
          ['src/templates/pages/index.hbs', /{{{i18n "content"}}}/]
        );

        done();
      });
    });

  });
});