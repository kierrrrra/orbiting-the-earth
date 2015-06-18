/**
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _runSequence = require('run-sequence');

var _runSequence2 = _interopRequireDefault(_runSequence);

var _browserSync = require('browser-sync');

var _browserSync2 = _interopRequireDefault(_browserSync);

var _swPrecache = require('sw-precache');

var _swPrecache2 = _interopRequireDefault(_swPrecache);

var _gulpLoadPlugins = require('gulp-load-plugins');

var _gulpLoadPlugins2 = _interopRequireDefault(_gulpLoadPlugins);

var _psi = require('psi');

var _packageJson = require('./package.json');

var _packageJson2 = _interopRequireDefault(_packageJson);

var $ = (0, _gulpLoadPlugins2['default'])();
var reload = _browserSync2['default'].reload;

// Lint JavaScript
_gulp2['default'].task('jshint', function () {
  return _gulp2['default'].src('app/scripts/**/*.js').pipe(reload({ stream: true, once: true })).pipe($.jshint()).pipe($.jshint.reporter('jshint-stylish')).pipe($['if'](!_browserSync2['default'].active, $.jshint.reporter('fail')));
});

// Optimize images
_gulp2['default'].task('images', function () {
  return _gulp2['default'].src('app/images/**/*').pipe($.cache($.imagemin({
    progressive: true,
    interlaced: true
  }))).pipe(_gulp2['default'].dest('dist/images')).pipe($.size({ title: 'images' }));
});

// Copy all files at the root level (app)
_gulp2['default'].task('copy', function () {
  return _gulp2['default'].src(['app/*', '!app/*.html', 'node_modules/apache-server-configs/dist/.htaccess'], {
    dot: true
  }).pipe(_gulp2['default'].dest('dist')).pipe($.size({ title: 'copy' }));
});

// Copy web fonts to dist
_gulp2['default'].task('fonts', function () {
  return _gulp2['default'].src(['app/fonts/**']).pipe(_gulp2['default'].dest('dist/fonts')).pipe($.size({ title: 'fonts' }));
});

// Compile and automatically prefix stylesheets
_gulp2['default'].task('styles', function () {
  var AUTOPREFIXER_BROWSERS = ['ie >= 10', 'ie_mob >= 10', 'ff >= 30', 'chrome >= 34', 'safari >= 7', 'opera >= 23', 'ios >= 7', 'android >= 4.4', 'bb >= 10'];

  // For best performance, don't add Sass partials to `gulp.src`
  return _gulp2['default'].src(['app/**/*.scss', 'app/styles/**/*.css']).pipe($.changed('.tmp/styles', { extension: '.css' })).pipe($.sourcemaps.init()).pipe($.sass({
    precision: 10,
    includePaths: require('node-bourbon').includePaths
  }).on('error', $.sass.logError)).pipe($.autoprefixer(AUTOPREFIXER_BROWSERS)).pipe(_gulp2['default'].dest('.tmp'))
  // Concatenate and minify styles
  .pipe($['if']('*.css', $.csso())).pipe($.sourcemaps.write()).pipe(_gulp2['default'].dest('dist')).pipe($.size({ title: 'styles' }));
});

// Concatenate and minify JavaScript
_gulp2['default'].task('scripts', function () {
  return _gulp2['default'].src(['./app/scripts/app.js']).pipe($.concat('app.min.js')).pipe($.uglify({ preserveComments: 'some' }))
  // Output files
  .pipe(_gulp2['default'].dest('dist/scripts')).pipe($.size({ title: 'scripts' }));
});

// Scan your HTML for assets & optimize them
_gulp2['default'].task('html', function () {
  var assets = $.useref.assets({ searchPath: '{.tmp,app}' });

  return _gulp2['default'].src('app/**/**/*.html').pipe(assets)
  // Remove any unused CSS
  // Note: If not using the Style Guide, you can delete it from
  // the next line to only include styles your project uses.
  .pipe($['if']('*.css', $.uncss({
    html: ['app/index.html'],
    // CSS Selectors for UnCSS to ignore
    ignore: [/.navdrawer-container.open/, /.app-bar.open/]
  })))

  // Concatenate and minify styles
  // In case you are still using useref build blocks
  .pipe($['if']('*.css', $.csso())).pipe(assets.restore()).pipe($.useref())

  // Minify any HTML
  .pipe($['if']('*.html', $.minifyHtml()))
  // Output files
  .pipe(_gulp2['default'].dest('dist')).pipe($.size({ title: 'html' }));
});

// Clean output directory
_gulp2['default'].task('clean', function () {
  return (0, _del2['default'])(['.tmp', 'dist/*', '!dist/.git'], { dot: true });
});

// Watch files for changes & reload
_gulp2['default'].task('serve', ['styles'], function () {
  (0, _browserSync2['default'])({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'OTE',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'app']
  });

  _gulp2['default'].watch(['app/**/*.html'], reload);
  _gulp2['default'].watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
  _gulp2['default'].watch(['app/scripts/**/*.js'], ['jshint']);
  _gulp2['default'].watch(['app/images/**/*'], reload);
});

// Build and serve the output from the dist build
_gulp2['default'].task('serve:dist', ['default'], function () {
  (0, _browserSync2['default'])({
    notify: false,
    logPrefix: 'OTE',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist',
    baseDir: 'dist'
  });
});

// Build production files, the default task
_gulp2['default'].task('default', ['clean'], function (cb) {
  (0, _runSequence2['default'])('styles', ['jshint', 'html', 'scripts', 'images', 'fonts', 'copy'], cb);
});

// Run PageSpeed Insights
_gulp2['default'].task('pagespeed', function (cb) {
  // Update the below URL to the public URL of your site
  (0, _psi.output)('example.com', {
    strategy: 'mobile'
  }, cb);
});

// Load custom tasks from the `tasks` directory
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
// By default we use the PageSpeed Insights free (no API key) tier.
// Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
// key: 'YOUR_API_KEY'
