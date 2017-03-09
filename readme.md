# Web app generator [![Build Status](https://secure.travis-ci.org/interactive-pioneers/generator-pioneerapp.svg?branch=master)](http://travis-ci.org/interactive-pioneers/generator-pioneerapp) [![npm version](https://badge.fury.io/js/generator-pioneerapp.svg)](http://badge.fury.io/js/generator-pioneerapp)

[Yeoman](http://yeoman.io) generator that scaffolds out a front-end web app optimised for performant i18n functionality.

![](http://i.imgur.com/UoxDHXY.png)

## Features

* BrowserSync providing
  * preview server
  * live CSS injection
* CSS Autoprefixing
* Automagically lint your scripts
* Awesome Image Optimization (via OptiPNG, pngquant, jpegtran and gifsicle)
* Mocha Unit Testing with PhantomJS
* Automagically compile CoffeeScript & Sass (libsass) (Optional)
* [Assemble](http://assemble.io) template system (Optional) with
  * i18n
  * permalinks
  * rawinclude (e.g. for inline SVG sprite includes)
* Bootstrap for Sass (Optional)
* Modernizr (Optional)

## Requirements

- Node.js `^6.2.0`
- [Yeoman](http://yeoman.io)
- [generator-mocha](https://github.com/yeoman/generator-mocha)

## Getting Started

- Install generator with peer dependencies:

        $ npm i -g generator-pioneerapp yo generator-mocha

- Run:

        $ yo pioneerapp <name of app>

- Run `grunt` for building and `grunt serve` for preview.
- Run `grunt test` for unit tests
- Run `grunt qa` for comprehensive QA tests featuring JSHint, JSCS, Mocha unit tests

### Installing the very latest

- Clone the repository:

        $ git clone https://github.com/interactive-pioneers/generator-pioneerapp.git

- Symlink cloned repository to NPM libs, e.g.:

        $ ln -s <cloned repisitory folder> ~/.nvm/versions/node/v6.2.0/lib/node_modules/generator-pioneerapp

  When using [NVM](https://github.com/creationix/nvm), you can conclude exact location of NPM libs from `echo $NVM_PATH`.

- Run:

        $ yo pioneerapp <name of app>

- Run `grunt` for building and `grunt serve`.

## Options

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.

* `--coffee`

  Add support for [CoffeeScript](http://coffeescript.org/).


## Contributing

* In lieu of a formal styleguide, take care to maintain the existing coding style
* Add unit tests for any new or changed functionality
* Lint and test your code using `npm test`
* When committing code, use [conventional Git commit message(s)](https://github.com/interactive-pioneers/conventions#commits)
* Submit Pull Request

## Licence

Copyright © 2016 Interactive Pioneers GmbH, [contributors](https://github.com/interactive-pioneers/generator-pioneerapp/graphs/contributors). Licenced under [GPL-3](LICENSE).
