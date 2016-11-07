var config       = require('../config')
var changed      = require('gulp-changed')
var gulp         = require('gulp')
var path         = require('path')
var stylemod     = require('gulp-style-modules')
var gulpif       = require('gulp-if')
var browserSync  = require('browser-sync')
var sass         = require('gulp-sass')
var sourcemaps   = require('gulp-sourcemaps')
var handleErrors = require('../lib/handleErrors')
var autoprefixer = require('gulp-autoprefixer')
var cssnano      = require('gulp-cssnano')


var paths = {
  src: [],
  dest: path.join(config.root.dest, config.tasks.webcomponents.dest)
}
config.tasks.css.extensions.forEach(function(val) {
  paths.src.push(path.join(config.root.src, config.tasks.webcomponents.src, '/**/*.'+val))
})
paths.src.push(path.join('!' + config.root.src, config.tasks.webcomponents.src, '/README.md'))


var stylemodTask = function () {
  return gulp.src(paths.src)
  .pipe(changed(paths.dest)) // Ignore unchanged files
  .pipe(sass(config.tasks.css.sass))
  .on('error', handleErrors)
  .pipe(autoprefixer(config.tasks.css.autoprefixer))
  .pipe(gulpif(global.production, cssnano({autoprefixer: false})))
  .pipe(gulpif(!global.production, sourcemaps.write()))
  .pipe(stylemod({
    filename: function(file) {
      //unique component name is name of last folder
      var componentName = path.dirname(file.path).split(path.sep).pop()
      return componentName + "-" + path.basename(file.path, path.extname(file.path));
    },
    moduleId: function (file) {
      //unique component name is name of last folder
      var componentName = path.dirname(file.path).split(path.sep).pop()
      return componentName + "-" + path.basename(file.path, path.extname(file.path));
    }
  }))
  .pipe(gulp.dest(paths.dest))
  .pipe(browserSync.stream())
}

gulp.task('stylemod', stylemodTask)
module.exports = stylemodTask