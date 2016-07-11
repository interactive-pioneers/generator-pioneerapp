/*global describe, beforeEach, it*/

var path = require('path');
var assert = require('assert');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var _ = require('underscore');

describe('Webapp generator', function() {
  // not testing the actual run of generators yet
  it('the generator can be required without throwing', function() {
    this.app = require('../app');
  });

  describe('run test', function() {

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
      'src/data/i18n/de_DE.yml',
      'src/templates/pages/home/index.hbs'
    ];
    var assembleI18NFileContent = [
      ['Gruntfile.js', /assemble-contrib-i18n/],
      ['Gruntfile.js', /assemble-contrib-permalinks/],
      ['Gruntfile.js', /templateRoot:/],
      ['src/templates/pages/index.hbs', /{{{i18n "content"}}}/],
      ['package.json', /"assemble":/],
      ['package.json', /"assemble-contrib-permalinks":/],
      ['package.json', /"assemble-contrib-i18n":/]
    ];

    var options = {
      'skip-install-message': true,
      'skip-install': true,
      'skip-welcome-message': true,
      'skip-message': true
    };

    var runGen;

    beforeEach(function() {
      runGen = helpers
        .run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, '.tmp'))
        .withArguments(['app'])
        .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']]);
    });

    it.only('creates expected files', function(done) {
      runGen.withOptions(options).on('end', function() {

        assert.file([].concat(
          expected,
          'app/styles/main.css',
          'app/scripts/main.js',
          'app/scripts/ie.js',
          'app/scripts/debug.js'
        ));
        assert.noFile([
          'app/styles/main.scss',
          'app/scripts/main.coffee',
          'app/scripts/debug.coffee',
          'app/scripts/ie.coffee'
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

    it('creates expected CoffeeScript files', function(done) {
      runGen.withOptions(
        _.extend(options, {coffee: true})
      ).on('end', function() {

        assert.file([].concat(
          expected,
          'app/scripts/main.coffee',
          'app/scripts/debug.coffee',
          'app/scripts/ie.coffee'
        ));
        assert.noFile([
          'app/scripts/main.js',
          'app/scripts/ie.js',
          'app/scripts/debug.js'
        ]);

        assert.fileContent([].concat(
          expectedContent,
          [['Gruntfile.js', /coffee/]]
        ));

        done();
      });
    });

    it('creates expected modernizr components', function(done) {
      runGen.withOptions(options).withPrompts({features: ['includeModernizr']})
      .on('end', function() {

        assert.fileContent([
          ['Gruntfile.js', /modernizr/],
          ['app/index.html', /modernizr/],
          ['bower.json', /modernizr/],
          ['package.json', /modernizr/],
        ]);

        done();
      });
    });

    it('creates expected bootstrap components', function(done) {
      runGen.withOptions(options).withPrompts({features: ['includeBootstrap']})
      .on('end', function() {

        assert.fileContent([
          ['Gruntfile.js', /bootstrap/],
          ['app/index.html', /bootstrap/],
          ['bower.json', /bootstrap/]
        ]);

        done();
      });
    });

    it('creates expected node SASS files', function(done) {
      runGen.withOptions(options).withPrompts({
        features: ['includeSass'],
        libsass: true
      }).on('end', function() {

        assert.file([
          'app/styles/base/.gitkeep',
          'app/styles/gui/.gitkeep',
          'app/styles/generic/.gitkeep'
        ]);

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

    it('creates expected SASS and Bootstrap components', function(done) {
      runGen.withOptions(options).withPrompts({
        features: ['includeSass', 'includeBootstrap']
      }).on('end', function() {

        assert.fileContent([
          ['Gruntfile.js', /bootstrap-sass-official/],
          ['app/index.html', /Sass is a mature/],
          ['bower.json', /bootstrap-sass-official/]
        ]);

        assert.noFileContent([
          ['package.json', /"assemble":/],
          ['package.json', /"assemble-contrib-permalinks":/],
          ['package.json', /"assemble-contrib-i18n":/]
        ]);

        done();
      });
    });

    it('creates expected clean Assemble structure', function(done) {
      runGen.withOptions(options).withPrompts({
        features: ['includeAssemble']
      }).on('end', function() {

        assert.file(assemble);

        assert.noFile(assembleI18N);

        assert.fileContent([
          ['Gruntfile.js', /assemble/],
          ['Gruntfile.js', /newer:assemble:index/],
          ['Gruntfile.js', /newer:assemble:pages/],
          ['src/templates/pages/index.hbs', /{{title}}/],
          ['package.json', /"assemble":/],
          ['package.json', /"assemble-contrib-permalinks":/]
        ]);

        assert.noFileContent([
          ['package.json', /"assemble-contrib-i18n":/]
        ]);

        done();
      });
    });

    it('creates expected i18n-capable Assemble structure', function(done) {
      runGen.withOptions(options).withPrompts({
        features: ['includeAssemble', 'includeAssembleI18N']
      }).on('end', function() {

        assert.file([].concat(assemble, assembleI18N));

        assert.fileContent(assembleI18NFileContent);

        assert.noFileContent([
          ['Gruntfile.js', /newer:assemble:index/],
          ['Gruntfile.js', /newer:assemble:pages/],
        ]);

        done();
      });
    });

    it('creates expected i18n-capable Assemble structure without Assemble selected', function(done) {
      runGen.withOptions(options).withPrompts({
        features: ['includeAssembleI18N']
      }).on('end', function() {

        assert.file([].concat(assemble, assembleI18N));

        assert.fileContent(assembleI18NFileContent);

        done();
      });
    });

    // TODO implement tests against wiredep
    /*it('wiredeps dependencies on Assemble', function (done) {
      runGen.withOptions(options).withPrompts({
        features: ['includeAssemble']
      }).on('end', function () {


        assert.file([].concat(assemble, assembleI18N));

        assert.fileContent(assembleI18NFileContent);

        done();
      });
    });*/

  });
});
