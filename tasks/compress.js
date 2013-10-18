/*globals require*/
module.exports = function  (grunt) {

  'use strict';

  var optipng = require('optipng-bin');
  var fs = require('fs');
  var path = require('path');
  var filesize = require('filesize');
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

    var options = this.options({
      'compression': 3,
      'format': 'png',
      'destDir': '',
      'srcDir': ''
    });

    if (!options.files.length) {

      grunt.file.write(destStylus, '');
      grunt.log.warn('no files were found');
      return done();
    }

    async.forEach(options.files, minifiyImage, function () {

      if(err) {
        throw err;
      }

      done();
    });
  }

  grunt.registerTask('compress', compress);
};