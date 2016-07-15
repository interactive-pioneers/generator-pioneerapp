# Web app generator [![Build Status](https://secure.travis-ci.org/interactive-pioneers/generator-pioneerapp.svg?branch=master)](http://travis-ci.org/interactive-pioneers/generator-pioneerapp) [![npm version](https://badge.fury.io/js/generator-pioneerapp.svg)](http://badge.fury.io/js/generator-pioneerapp)

[Yeoman](http://yeoman.io) generator that scaffolds out a front-end web app optimised for performant i18n functionality.

![](https://github.com/interactive-pioneers/generator-pioneerapp/blob/master/screenshot.png)

## Features

* CSS Autoprefixing
* BrowserSync providing
  * preview server
  * live CSS injection
* Automagically compile CoffeeScript & Sass (libsass)
* Automagically lint your scripts
* Awesome Image Optimization (via OptiPNG, pngquant, jpegtran and gifsicle)
* Mocha Unit Testing with PhantomJS
* Optional Assemble template system with
  * i18n
  * permalinks
* Optional Bootstrap for Sass
* Optional Modernizr

For more information on what `generator-pioneerapp` can do for you, take a look at the [Grunt tasks](https://github.com/interactive-pioneers/generator-pioneerapp/blob/master/app/templates/_package.json) used in our `package.json`.

## Getting Started

- Install generator with peer dependencies: `npm i -g generator-pioneerapp yo generator-mocha`
- Run:

    $ yo pioneerapp <name of app>

- Run `grunt` for building and `grunt serve` for preview.
- Run `grunt test` for unit tests
- Run `grunt qa` for comprehensive QA tests featuring JSHint, JSCS, Mocha unit tests

#### Installing the very latest

- Clone the repository: `git clone https://github.com/interactive-pioneers/generator-pioneerapp.git`
- Move into the cloned directory: `cd generator-pioneerapp`
- Install: `npm i -g .`
- Move into your project folder: `cd <your project folder>`
- Run:

    $ yo pioneerapp <name of app>

- Run `grunt` for building and `grunt serve` for preview[\*](#grunt-serve-note).

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
