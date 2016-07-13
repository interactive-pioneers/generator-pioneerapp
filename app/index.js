'use strict';

var join = require('path').join;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var slugify = require('underscore.string/slugify');
var mkdirp = require('mkdirp');

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

    this.option('coffee', {
      desc: 'Add CoffeeScript support',
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
      }, {
        type: 'confirm',
        name: 'includeJQuery',
        message: 'Would you like to include jQuery?',
        default: true,
        when: function(answers) {
          return answers.features.indexOf('includeBootstrap') === -1;
        }
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
      this.includeJQuery = hasFeature('includeJQuery');

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
        includeJQuery: this.includeJQuery,
        pkg: this.pkg,
        appname: this.appname,
        coffee: this.options['coffee']
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
      var bowerJson = {
        name: slugify(this.appname),
        private: true,
        dependencies: {}
      };

      if (this.includeBootstrap) {
        if (this.includeSass) {
          bowerJson.dependencies['bootstrap-sass'] = '~3.3.5';
          bowerJson.overrides = {
            'bootstrap-sass': {
              'main': [
                'assets/stylesheets/_bootstrap.scss',
                'assets/fonts/bootstrap/*',
                'assets/javascripts/bootstrap.js'
              ]
            }
          };
        } else {
          bowerJson.dependencies['bootstrap'] = '~3.3.5';
          bowerJson.overrides = {
            'bootstrap': {
              'main': [
                'less/bootstrap.less',
                'dist/css/bootstrap.css',
                'dist/js/bootstrap.js',
                'dist/fonts/*'
              ]
            }
          };
        }
      } else if (this.includeJQuery) {
        bowerJson.dependencies['jquery'] = '~2.2.4';
      }

      if (this.includeModernizr) {
        bowerJson.dependencies['modernizr'] = '~2.8.1';
      }

      this.fs.writeJSON(this.destinationPath('bower.json'), bowerJson);

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
    },

    jscs: function() {
      this.fs.copy(
        this.templatePath('.jscsrc'),
        this.destinationPath('.jscsrc')
      );
    },

    editor: function() {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );

      var ternJson = {
        libs: [
          'browser',
          'underscrore'
        ],
        plugins: {
          node: {}
        }
      };

      if (this.includeJQuery) {
        ternJson.libs.push('jquery');
      }

      this.fs.writeJSON(this.destinationPath('.tern-project'), ternJson);
    },

    stylesheet: function() {
      var style = 'main.' + (this.includeSass ? 's' : '') + 'css';
      this.fs.copyTpl(
        this.templatePath(style),
        this.destinationPath('app/styles/' + style),
        this.templateData
      );
    },

    html: function() {
      var bsPath;

      // path prefix for Bootstrap JS files
      if (this.includeBootstrap) {
        bsPath = '/bower_components/';

        if (this.includeSass) {
          bsPath += 'bootstrap-sass/assets/javascripts/bootstrap/';
        } else {
          bsPath += 'bootstrap/js/';
        }
      }

      this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath('app/index.html'),
        {
          appname: this.appname,
          includeBootstrap: this.includeBootstrap,
          includeSass: this.includeSass,
          includeModernizr: this.includeModernizr,
          bsPath: bsPath,
          bsPlugins: [
            'affix',
            'alert',
            'dropdown',
            'tooltip',
            'modal',
            'transition',
            'button',
            'popover',
            'carousel',
            'scrollspy',
            'collapse',
            'tab'
          ]
        }
      );
    },

    app: function() {

      mkdirp(this.destinationPath('app') + '/scripts');
      mkdirp(this.destinationPath('app') + '/styles');
      mkdirp(this.destinationPath('app') + '/images/layout');
      mkdirp(this.destinationPath('app') + '/images/style');
      mkdirp(this.destinationPath('app') + '/images/temp');
      mkdirp(this.destinationPath('app') + '/images/videos');
      mkdirp(this.destinationPath('app') + '/fonts');

      this.fs.write(this.destinationPath('app') + '/images/layout/.gitkeep', '');
      this.fs.write(this.destinationPath('app') + '/images/style/.gitkeep', '');
      this.fs.write(this.destinationPath('app') + '/images/temp/.gitkeep', '');
      this.fs.write(this.destinationPath('app') + '/images/videos/.gitkeep', '');
      this.fs.write(this.destinationPath('app') + '/fonts/.gitkeep', '');

      if (this.includeSass) {
        mkdirp(this.destinationPath('app') + '/styles/base');
        mkdirp(this.destinationPath('app') + '/styles/generic');
        mkdirp(this.destinationPath('app') + '/styles/gui');

        this.fs.write(this.destinationPath('app') + '/styles/gui/.gitkeep', '');
        this.fs.write(this.destinationPath('app') + '/styles/generic/.gitkeep', '');
        this.fs.write(this.destinationPath('app') + '/styles/base/.gitkeep', '');
      }

      if (this.options['coffee']) {
        this.fs.write(this.destinationPath('app/scripts/main.coffee'), 'console.log "\'Allo from CoffeeScript!"');
        this.fs.write(this.destinationPath('app/scripts/debug.coffee'), '');
        this.fs.write(this.destinationPath('app/scripts/ie.coffee'), '');
      } else {
        this.fs.write(this.destinationPath('app') + '/scripts/main.js', 'console.log(\'\\\'Allo \\\'Allo!\');');
        this.fs.write(this.destinationPath('app') + '/scripts/debug.js', '');
        this.fs.write(this.destinationPath('app') + '/scripts/ie.js', '');
      }

      this.fs.copy(
        this.templatePath('app/apple-touch-icon.png'),
        this.destinationPath('app/apple-touch-icon.png')
      );

      this.fs.copy(
        this.templatePath('app/favicon.ico'),
        this.destinationPath('app/favicon.ico')
      );

      this.fs.copy(
        this.templatePath('app/robots.txt'),
        this.destinationPath('app/robots.txt')
      );
    },

    src: function() {
      if (this.includeAssemble || this.includeAssembleI18N) {
        mkdirp(this.destinationPath('src/data'));
        mkdirp(this.destinationPath('src/templates/layouts'));
        mkdirp(this.destinationPath('src/templates/pages'));
        mkdirp(this.destinationPath('src/templates/partials'));

        this.fs.copyTpl(
          this.templatePath('.src/data/config.yml'),
          this.destinationPath('src/data/config.yml'),
          this.templateData
        );

        this.fs.copyTpl(
          this.templatePath('.src/templates/pages/index.hbs'),
          this.destinationPath('src/templates/pages/index.hbs'),
          this.templateData
        );

        this.fs.copyTpl(
          this.templatePath('.src/templates/layouts/default.hbs'),
          this.destinationPath('src/templates/layouts/default.hbs'),
          this.templateData
        );

        this.fs.copyTpl(
          this.templatePath('.src/templates/partials/header.hbs'),
          this.destinationPath('src/templates/partials/header.hbs'),
          this.templateData
        );

        this.fs.copyTpl(
          this.templatePath('.src/templates/partials/footer.hbs'),
          this.destinationPath('src/templates/partials/footer.hbs'),
          this.templateData
        );

        if (this.includeAssembleI18N) {
          mkdirp(this.destinationPath('src/data/i18n'));

          this.fs.copyTpl(
            this.templatePath('.src/data/i18n/de_DE.yml'),
            this.destinationPath('src/data/i18n/de_DE.yml'),
            this.templateData
          );

          this.fs.copyTpl(
            this.templatePath('.src/data/i18n/en_GB.yml'),
            this.destinationPath('src/data/i18n/en_GB.yml'),
            this.templateData
          );

          this.fs.copyTpl(
            this.templatePath('.src/data/i18n/i18n.yml'),
            this.destinationPath('src/data/i18n/i18n.yml'),
            this.templateData
          );

          mkdirp(this.destinationPath('src/templates/pages/home'));
          this.fs.copyTpl(
            this.templatePath('.src/templates/pages/home/index.hbs'),
            this.destinationPath('src/templates/pages/home/index.hbs'),
            this.templateData
          );
        }
      }
    }
  },

  install: function() {
    this.installDependencies({
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install']
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
