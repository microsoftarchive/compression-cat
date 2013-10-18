/*globals require*/
module.exports = function  (grunt) {

  'use strict';

  var optipng = require('optipng-bin');
  var fs = require('fs');
  var path = require('path');
  var filesize = require('filesize');
  var async = grunt.util.async;
  var _ = grunt.util._;
  var options;

  require('colors');

  function minifiyImage(file, callback) {

    file = path.resolve(file);

    var optipngArgs = ['-strip', 'all', '-o', options.compression, '-out', file, file];
    var originalSize = fs.statSync(file).size;

    grunt.util.spawn({
      'cmd': optipng.path,
      'args': optipngArgs
    }, function (err, result, code) {

      var newSize = fs.statSync(file).size;
      var diff = originalSize - newSize;

      if(result.stderr.indexOf('already optimized') !== -1 || diff < 10) {
        grunt.log.writeln('  \u2713'.green, 'already optimized');
      } else {
        grunt.log.writeln('  \u2713'.green, 'optimized', filesize(newSize, 2, false));
        grunt.log.writeln('--- saved', filesize(diff, 2, false));
      }

      process.nextTick(callback);
    });
  }

  function compress() {

    var done = this.async();

    options = this.options({
      'compression': 3
    });

    if (!options.files.length) {

      grunt.log.warn('no files were found');
      return done();
    }

    // we limit this for instance where something like a giant library of emoji
    // destory the process. Maybe this is an option for the future
    async.forEachLimit(options.files, 30, minifiyImage, function (err) {

      if(err) {
        throw err;
      }

      done();
    });
  }

  grunt.registerTask('compression-cat', compress);
};