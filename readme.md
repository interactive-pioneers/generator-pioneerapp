# Web app generator [![Build Status](https://secure.travis-ci.org/interactive-pioneers/generator-pioneerapp.svg?branch=master)](http://travis-ci.org/interactive-pioneers/generator-pioneerapp)

[Yeoman](http://yeoman.io) generator that scaffolds out a front-end web app optimised for performant i18n functionality.

![](http://i.imgur.com/uKTT2Hj.png)

## Features

* CSS Autoprefixing
* Built-in preview server with LiveReload
* Live CSS injection with BrowserSync
* Automagically compile CoffeeScript & Sass (libsass)
* Automagically lint your scripts
* Automagically wire up your Bower components with [grunt-wiredep](#third-party-dependencies).
* Awesome Image Optimization (via OptiPNG, pngquant, jpegtran and gifsicle)
* Mocha Unit Testing with PhantomJS
* Assemble template system (Optional)
* Assemble template system with i18n (Optional)
* Bootstrap for Sass (Optional)
* Leaner Modernizr builds (Optional)

For more information on what `generator-pioneerapp` can do for you, take a look at the [Grunt tasks](https://github.com/interactive-pioneers/generator-pioneerapp/blob/master/app/templates/_package.json) used in our `package.json`.


## Getting Started

- Install: `npm install -g generator-pioneerapp`
- Run: `yo pioneerapp`
- Run `grunt` for building and `grunt serve` for preview[\*](#grunt-serve-note). `--allow-remote` option for remote access.

#### Installing the very latest

- Clone the repository: `git clone https://github.com/interactive-pioneers/generator-pioneerapp.git`
- Move into the cloned directory: `cd generator-pioneerapp`
- Install: `npm i -g .`
- Move into your project folder: `cd <your project folder>`
- Run: `yo pioneerapp`
- Run `grunt` for building and `grunt serve` for preview[\*](#grunt-serve-note). `--allow-remote` option for remote access.

#### Third-Party Dependencies

*(HTML/CSS/JS/Images/etc)*

Third-party dependencies are managed with [grunt-wiredep](https://github.com/stephenplusplus/grunt-wiredep). Add new dependencies using **Bower** and then run the **Grunt** task to load them:

```sh
$ bower install --save jquery
$ grunt wiredep
```

This works if the package author has followed the [Bower spec](https://github.com/bower/bower.json-spec). If the files are not automatically added to your source code, check with the package's repo for support and/or file an issue with them to have it updated.

To manually add dependencies, `bower install --save depName` to get the files, then add a `script` or `style` tag to your `index.html` or another appropriate place.

The components are installed in the root of the project at `/bower_components`. To reference them from index.html, use `src="bower_components"` or `src="/bower_components"`. Treat the `bower_components` directory as if it was a sibling to `index.html`.

*Testing Note*: a project checked into source control and later checked out needs to have `bower install` run from the `test` folder as well as from the project root.


#### Grunt Serve Note

Note: `grunt server` was used for previewing in earlier versions of the project, and has since been deprecated in favor of `grunt serve`.


## Docs

We have [recipes](docs/recipes) for integrating other popular technologies like Compass.


## Options

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.

* `--test-framework=<framework>`

  Defaults to `mocha`. Can be switched for another supported testing framework like `jasmine`.

* `--coffee`

  Add support for [CoffeeScript](http://coffeescript.org/).


## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md).

Note: We are regularly asked whether we can add or take away features. If a change is good enough to have a positive impact on all users, we are happy to consider it.

If not, `generator-pioneerapp` is fork-friendly and you can always maintain a custom version which you `npm install && npm link` to continue using via `yo pioneerapp` or a name of your choosing.


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)