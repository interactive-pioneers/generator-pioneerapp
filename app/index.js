'use strict';

var join = require('path').join;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var slugify = require('underscore.string/slugify');

module.exports = yeoman.Base.extend({
  constructor: function() {
    yeoman.Base.apply(this, arguments);

    this.argument('appname', {type: String, required: true});
    this.appname = slugify(this.appname);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });

    var testLocal = require.resolve('generator-mocha/generators/app/index.js');

    this.composeWith('mocha:app', {
      options: {
        'skip-install': this.options['skip-install']
      }
    }, {
      local: testLocal
    });

  },

  initializing: function() {
    this.pkg = require('../package.json');
  },

  prompting: function() {
    var done = this.async();

    // welcome message
    if (!this.options['skip-welcome-message']) {
      this.log(yosay('\'Allo \'allo! Out of the box I include HTML5 Boilerplate, Mocha, and a gruntfile.'));
    }

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Sass',
        value: 'includeSass',
        checked: true
      },{
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: true
      }, {
        name: 'Assemble',
        value: 'includeAssemble',
        checked: true
      }, {
        name: 'Assemble i18n',
        value: 'includeAssembleI18N',
        checked: true
      }, {
        name: 'Bootstrap',
        value: 'includeBootstrap',
        checked: false
      }]
    }];

    this.prompt(prompts).then(function(answers) {

      var features = answers.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.includeSass = hasFeature('includeSass');
      this.includeBootstrap = hasFeature('includeBootstrap');
      this.includeModernizr = hasFeature('includeModernizr');
      this.includeAssemble = hasFeature('includeAssemble');
      this.includeAssembleI18N = hasFeature('includeAssembleI18N');

      if (this.includeAssembleI18N) {
        this.includeAssemble = true;
      }

      this.includeLibSass = true;

      this.templateData = {
        includeModernizr: this.includeModernizr,
        includeSass: this.includeSass,
        includeAssemble: this.includeAssemble,
        includeAssembleI18N: this.includeAssembleI18N,
        includeBootstrap: this.includeBootstrap,
        includeLibSass: this.includeLibSass,
        pkg: this.pkg,
        appname: this.appname,
        // TODO: implement CoffeeScript into prompt (or remove completely)
        coffee: false
      };

      done();
    }.bind(this));
  },

  writing: {

    gruntfile: function() {
      this.fs.copyTpl(
        this.templatePath('Gruntfile.js'),
        this.destinationPath('Gruntfile.js'),
        this.templateData
      );
    },

    packageJSON: function() {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this.templateData
      );
    },

    readme: function() {
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('README.md'),
        this.templateData
      );
    },

    git: function() {
      this.fs.copyTpl(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore'),
        this.templateData
      );
      this.fs.copy(
        this.templatePath('gitattributes'),
        this.destinationPath('.gitattributes')
      );
    },

    bower: function() {
      this.fs.copyTpl(
        this.templatePath('bower.json'),
        this.destinationPath('bower.json'),
        this.templateData
      );
    },

    bowerrc: function() {
      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );
    },

    jshint: function() {
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }

    /*editorConfig: function() {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },

    mainStylesheet: function() {
      var css = 'main.' + (this.includeSass ? 's' : '') + 'css';
      this.template(css, 'app/styles/' + css);
    },

    writeIndex: function() {
      this.indexFile = this.engine(
        this.readFileAsString(join(this.sourceRoot(), 'index.html')),
        this
      );

      // wire Bootstrap plugins
      if (this.includeBootstrap && !this.includeSass) {
        var bs = 'bower_components/bootstrap/js/';

        this.indexFile = this.appendFiles({
          html: this.indexFile,
          fileType: 'js',
          optimizedPath: 'scripts/plugins.js',
          sourceFileList: [
            bs + 'affix.js',
            bs + 'alert.js',
            bs + 'dropdown.js',
            bs + 'tooltip.js',
            bs + 'modal.js',
            bs + 'transition.js',
            bs + 'button.js',
            bs + 'popover.js',
            bs + 'carousel.js',
            bs + 'scrollspy.js',
            bs + 'collapse.js',
            bs + 'tab.js'
          ],
          searchPath: '.'
        });
      }

      this.indexFile = this.appendFiles({
        html: this.indexFile,
        fileType: 'js',
        optimizedPath: 'scripts/main.js',
        sourceFileList: ['scripts/main.js'],
        searchPath: ['app', '.tmp']
      });
    },

    app: function() {
      this.directory('app');
      this.mkdir('app/scripts');
      this.mkdir('app/styles');
      this.mkdir('app/images/layout');
      this.mkdir('app/images/style');
      this.mkdir('app/images/temp');
      this.mkdir('app/images/videos');
      this.mkdir('app/fonts');
      this.write('app/index.html', this.indexFile);
      this.write('app/images/layout/.gitkeep', '');
      this.write('app/images/style/.gitkeep', '');
      this.write('app/images/temp/.gitkeep', '');
      this.write('app/images/videos/.gitkeep', '');
      this.write('app/fonts/.gitkeep', '');

      this.write('app/scripts/main.js', 'console.log(\'\\\'Allo \\\'Allo!\');');
      this.write('app/scripts/debug.js', '');
      this.write('app/scripts/ie.js', '');

      if (this.includeSass) {
        this.mkdir('app/styles/base');
        this.mkdir('app/styles/generic');
        this.mkdir('app/styles/gui');
        this.write('app/styles/gui/.gitkeep', '');
        this.write('app/styles/generic/.gitkeep', '');
        this.write('app/styles/base/.gitkeep', '');
      }
    },

    src: function() {
      if (this.includeAssemble || this.includeAssembleI18N) {
        this.directory('src');
        this.mkdir('src/data');
        this.mkdir('src/templates/layouts');
        this.mkdir('src/templates/pages');
        this.mkdir('src/templates/partials');

        this.template('.src/data/config.yml', 'src/data/config.yml');
        this.template('.src/templates/pages/index.hbs', 'src/templates/pages/index.hbs');
        this.template('.src/templates/layouts/default.hbs', 'src/templates/layouts/default.hbs');
        this.template('.src/templates/partials/header.hbs', 'src/templates/partials/header.hbs');
        this.template('.src/templates/partials/footer.hbs', 'src/templates/partials/footer.hbs');

        if (this.includeAssembleI18N) {
          this.mkdir('src/data/i18n');
          this.template('.src/data/i18n/de_DE.yml', 'src/data/i18n/de_DE.yml');
          this.template('.src/data/i18n/en_GB.yml', 'src/data/i18n/en_GB.yml');
          this.template('.src/data/i18n/i18n.yml', 'src/data/i18n/i18n.yml');
          this.mkdir('src/templates/pages/home');
          this.template('.src/templates/pages/home/index.hbs', 'src/templates/pages/home/index.hbs');
        }
      }
    }*/
  },

  install: function() {
    this.installDependencies({
      skipMessage: false, //this.options['skip-install-message'],
      skipInstall: false //this.options['skip-install']
    });
  },

  end: function() {
    var bowerJson = this.fs.readJSON(this.destinationPath('bower.json'));
    var howToInstall =
      '\nAfter running ' +
      chalk.yellow.bold('npm install & bower install') +
      ', inject your' +
      '\nfront end dependencies by running ' +
      chalk.yellow.bold('grunt wiredep') +
      '.';

    if (this.options['skip-install']) {
      this.log(howToInstall);
      return;
    }
  }
});
