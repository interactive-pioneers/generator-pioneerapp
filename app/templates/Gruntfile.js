// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    browserSync: 'grunt-browser-sync'
  });

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist',
    src: 'src',
    test: 'test',
    pkg: grunt.file.readJSON('package.json')
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },<% if (coffee) { %>
      coffee: {
        files: ['<%%= config.app %>/scripts/{,*/}*.{coffee,litcoffee,coffee.md}'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['<%%= config.test %>/spec/{,*/}*.{coffee,litcoffee,coffee.md}'],
        tasks: ['coffee:test', 'test:watch']
      },<% } else { %>
      js: {
        files: [
          '<%%= config.app %>/scripts/{,*/}*.js',
          '<%%= config.test %>/spec/*.js'
        ],
        tasks: ['jshint', 'jscs'],
      },
      jstest: {
        files: ['<%%= config.test %>/spec/{,*/}*.js'],
        tasks: ['mocha:reportless']
      },<% } %>
      gruntfile: {
        files: ['Gruntfile.js']
      },<% if (includeSass) { %>
      sass: {
        files: ['<%%= config.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'autoprefixer']
      },<% } %>
      styles: {
        files: ['<%%= config.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      }<% if (includeAssemble) { %>,
      // newer task can not be used over structural reasons in case of i18n.
      templateRoot: {
        files: [
          '<%%= config.src %>/templates/pages/*.hbs',
          '<%%= config.src %>/data/{,*/}*.yml',
          '<%%= config.src %>/templates/{partials,layouts}/*.hbs'
        ],
        tasks: ['assemble:index']
      },
      template: {
        files: [
          '<%%= config.src %>/data/{,*/}*.yml',
          '<%%= config.src %>/templates/{partials,layouts}/*.hbs',
          '<%%= config.src %>/templates/pages/{*/,}*.hbs'
        ],
        tasks: ['assemble:pages']
      }<% } %>
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%%= config.dist %>/*',
            '!<%%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%%= config.app %>/scripts/{,*/}*.js',
        '!<%%= config.app %>/scripts/vendor/*',
        '<%%= config.test %>/spec/{,*/}*.js'
      ]
    },

    jscs: {
      src: [
        'Gruntfile.js',
        '<%%= config.app %>/scripts/{,*/}*.js',
        '!<%%= config.app %>/scripts/vendor/*',
        '<%%= config.test %>/spec/{,*/}*.js'
      ],
      options: {
        config: '.jscsrc',
        verbose: true
      }
    },

    <%
    /*
     * TODO:
     * - optimise
     * - finalise mocha generation so that it would safely fall through
     */
    %>mocha: {
      all: {
        options: {
          run: true,
          reporter: './node_modules/mocha-bamboo-reporter'
        },
        src: ['<%%= config.test %>/*.html']
      },
      reportless: {
        options: {
          run: true,
          log: true
        },
        src: ['<%%= config.test %>/*.html']
      },
    },<% if (coffee) { %>

    coffee: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/scripts',
          src: '{,*/}*.{coffee,litcoffee,coffee.md}',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: '<%%= config.test %>/spec',
          src: '{,*/}*.{coffee,litcoffee,coffee.md}',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },<% } if (includeSass) { %>

    sass: {
      options: {<% if (includeLibSass) { %>
        sourceMap: true,
        includePaths: ['bower_components']<% } else { %>
        loadPath: 'bower_components'<% } %>
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      }
    },<% } %>

    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        ignorePath: /^<%%= config.app %>\/|\.\.\//,
        src: ['<%%= config.app %>/{,*_*/**}*.html']<% if (includeBootstrap) { %>,<% if (includeSass) { %>
        exclude: ['bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js']<% } else { %>
        exclude: ['bower_components/bootstrap/dist/js/bootstrap.js']<% } } %>
      }<% if (includeSass) { %>,
      sass: {
        src: ['<%%= config.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }<% } %>
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%%= config.dist %>/scripts/{,*/}*.js',
            '<%%= config.dist %>/styles/{,*/}*.css',
            '<%%= config.dist %>/images/{,*/}*.*',
            '<%%= config.dist %>/styles/fonts/{,*/}*.*',
            '<%%= config.dist %>/*.{ico,png}'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%%= config.dist %>'
      },
      html: '<%%= config.app %>/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%%= config.dist %>',
          '<%%= config.dist %>/images',
          '<%%= config.dist %>/styles'
        ]
      },
      html: ['<%%= config.dist %>/{,*/}*.html'],
      css: ['<%%= config.dist %>/styles/{,*/}*.css']
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%%= config.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%%= config.dist %>',
          src: '{,*/}*.html',
          dest: '<%%= config.dist %>'
        }]
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of minification. These next options are pre-configured if you do not
    // wish to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%%= config.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%%= config.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%%= config.dist %>/scripts/scripts.js': [
    //         '<%%= config.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= config.app %>',
          dest: '<%%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.webp',
            '{,*/}*.html',
            'fonts/*.{eot,svg,ttf,woff}'
          ]
        }, {
          src: 'node_modules/apache-server-configs/dist/.htaccess',
          dest: '<%%= config.dist %>/.htaccess'
        }<% if (includeBootstrap) { %>, {
          expand: true,
          dot: true,
          cwd: '<% if (includeSass) {
              %>.<%
            } else {
              %>bower_components/bootstrap/dist<%
            } %>',
          src: '<% if (includeSass) {
              %>bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*<%
            } else {
              %>fonts/*<%
            } %>',
          dest: '<%%= config.dist %>'
        }<% } %>]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%%= config.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },<% if (includeModernizr) { %>

    // Generates a custom Modernizr build that includes only the tests you
    // reference in your app
    modernizr: {
      dist: {
        devFile: '<%%= config.app %>/bower_components/modernizr/modernizr.js',
        outputFile: '<%%= config.dist %>/scripts/vendor/modernizr.js',
        files: {
          src: [
            '<%%= config.dist %>/scripts/{,*/}*.js',
            '<%%= config.dist %>/styles/{,*/}*.css',
            '!<%%= config.dist %>/scripts/vendor/*'
          ]
        },
        uglify: true
      }
    },<% } %>

    assemble: {
      options: {
        flatten: true,
        layoutext: '.hbs',
        // FIXME: assets path malfunction https://github.com/assemble/grunt-assemble/issues/44
        // assets: '<%%= config.app %>',
        layoutdir: '<%%= config.src %>/templates/layouts',
        partials: ['<%%= config.src %>/templates/partials/*.hbs'],
        data: ['<%%= config.src %>/data/{i18n/,}*.yml'],
        helpers: []
      },
      <% // TODO implement default language into scaffold options %>
      index: {
        options: {
          plugins: ['grunt-assemble-i18n', 'grunt-assemble-permalinks'],
          i18n: {
            languages: ['de_DE'],
            language: 'de_DE',
            data: '<%%= config.src %>/data/i18n/de_DE.yml',
            templates: ['<%%= config.src %>/templates/pages/*.hbs'],
          },
          permalinks: {
            structure: ':slug:ext'
          }
        },
        src: '!*.*',
        dest: '<%%= config.app %>/'
      },
      pages: {
        options: {
          plugins: [
            'grunt-assemble-i18n',
            'grunt-assemble-permalinks'
          ],
          permalinks: {
            structure: ':language/:section/:slug:ext'
          },
          i18n: {
            data: '<%%= config.src %>/data/i18n/*.yml',
            templates: ['<%%= config.src %>/templates/pages/*/**.hbs'],
          }
        },
        src: '<%%= config.src %>/pages/{,*/}*.hbs',
        dest: '<%%= config.app %>/'
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [<% if (includeSass) { %>
        'sass:server',<% } if (coffee) {  %>
        'coffee:dist',<% } %>
        'copy:styles',<% if (includeAssemble) { %>
        'assemble:index',
        'assemble:pages'<% } %>
      ],<% if (includeAssemble) { %>
      assemble: [
        'assemble:index',
        'assemble:pages'
      ],<% } %>
      test: [<% if (coffee) { %>
        'coffee',<% } %>
        'copy:styles'
      ],
      dist: [<% if (coffee) { %>
        'coffee',<% } if (includeSass) { %>
        'sass',<% } %>
        'copy:styles',
        'imagemin',
        'svgmin'
      ],
      qa: [
        'jshint',
        'jscs',
        <% // TODO: finalise mocha generation so that it would safely fall through %>
        //'mocha',
        'pngcheck'
      ]
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: '.tmp/styles/main.css',
        },
        options: {
          watchTask: true
        }
      }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: [
            '.tmp/styles/*.css',
            '<%%= config.app %>/scripts/*.js',
            '<%%= config.app %>/{*_*/,}*.html'
          ]
        },
        options: {
          watchTask: true,
          server: {
            baseDir: [
              '.tmp',
              '<%%= config.app %>'
            ]
          }
        }
      }
    },

    pngcheck: {
      files: {
        src: ['<%%= config.app %>/images/{,**/}*.png']
      }
    }
  });

  grunt.registerTask('serve', 'Start server. Use --allow-remote for remote access', function(target) {
    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'wiredep',
      'autoprefixer',
      'browserSync',
      'watch'
    ]);
  });

  grunt.registerTask('server', function(target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('test', function(target) {
    if (target !== 'watch') {
      grunt.task.run([
        'clean:server',
        'concurrent:test',
        'copy:styles',
        'autoprefixer'
      ]);
    }

    grunt.task.run([
      'mocha'
    ]);
  });

  grunt.registerTask('qa', function() {
    grunt.task.run(['concurrent:qa']);
  });

  grunt.registerTask('build', [
    'clean:dist',<% if (includeAssemble) { %>
    'concurrent:assemble',<% } %>
    'wiredep',
    'concurrent:qa',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',<% if (includeModernizr) { %>
    'modernizr',<% } %>
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', ['build']);
};
