'use strict';

var join = require('path').join;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // setup the test-framework property, Gruntfile template will need this
    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });
    this.testFramework = this.options['test-framework'];

    this.option('coffee', {
      desc: 'Use CoffeeScript',
      type: Boolean,
      defaults: false
    });
    this.coffee = this.options.coffee;

    this.pkg = require('../package.json');
  },

  askFor: function () {
    var done = this.async();

    // welcome message
    if (!this.options['skip-welcome-message']) {
      this.log(require('yosay')());
      this.log(chalk.magenta(
        'Out of the box I include HTML5 Boilerplate, jQuery, and a ' +
        'Gruntfile.js to build your app.'
      ));
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

    this.prompt(prompts, function (answers) {
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

      done();
    }.bind(this));
  },

  gruntfile: function () {
    this.template('Gruntfile.js');
  },

  packageJSON: function () {
    this.template('_package.json', 'package.json');
  },

  readme: function() {
    this.template('README.md');
  },

  git: function () {
    this.template('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
  },

  bower: function () {
    var bower = {
      name: this._.slugify(this.appname),
      private: true,
      dependencies: {}
    };

    if (this.includeBootstrap) {
      var bs = 'bootstrap' + (this.includeSass ? '-sass-official' : '');
      bower.dependencies[bs] = "~3.2.0";
    } else {
      bower.dependencies.jquery = "~1.11.1";
    }

    if (this.includeModernizr) {
      bower.dependencies.modernizr = "~2.8.2";
    }

    this.copy('bowerrc', '.bowerrc');
    this.write('bower.json', JSON.stringify(bower, null, 2));
  },

  jshint: function () {
    this.copy('jshintrc', '.jshintrc');
  },

  editorConfig: function () {
    this.copy('editorconfig', '.editorconfig');
  },

  mainStylesheet: function () {
    var css = 'main.' + (this.includeSass ? 's' : '') + 'css';
    this.template(css, 'app/styles/' + css);
  },

  writeIndex: function () {
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

  app: function () {
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

    if (this.coffee) {
      this.write(
        'app/scripts/main.coffee',
        'console.log "\'Allo from CoffeeScript!"'
      );
      this.write('app/scripts/debug.coffee', '');
      this.write('app/scripts/ie.coffee', '');
    }
    else {
      this.write('app/scripts/main.js', 'console.log(\'\\\'Allo \\\'Allo!\');');
      this.write('app/scripts/debug.js', '');
      this.write('app/scripts/ie.js', '');
    }

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
  },

  install: function () {
    this.on('end', function () {
      this.invoke(this.options['test-framework'], {
        options: {
          'skip-message': this.options['skip-install-message'],
          'skip-install': this.options['skip-install'],
          'coffee': this.options.coffee
        }
      });

      if (!this.options['skip-install']) {
        this.installDependencies({
          skipMessage: this.options['skip-install-message'],
          skipInstall: this.options['skip-install']
        });
      }
    });
  }
});