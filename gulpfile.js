// Gulp dependencies
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var cp = require('child_process');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var reload = browserSync.reload;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var size = require('gulp-size');
var sourcemaps = require('gulp-sourcemaps');

// Gulp tasks
// Build the Jekyll Site
gulp.task('jekyll-build', function (done) {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

// Rebuild Jekyll & reload Browser-Sync
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});

// Wait for jekyll to build, then launch the server
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
  browserSync({
    server: { baseDir: '_site' },
    //port: 3000,
    //host: 10.0.1.3,
    //scrollProportionally: true,
    xip: true, //your.computer's.ip.xip.io:3000
    online: false
  });
});

// Compile Sass with gulp-sass (Node-Sass), autoprefix, & minify css
gulp.task('sass', function() {
  gulp.src('./assets/sass/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({
    errLogToConsole: true,
    outputStyle: 'compressed' }))
  .pipe(autoprefixer({browsers:['last 2 versions']}))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('_site/assets/css'))
  .pipe(rename('styles.css'))
  .pipe(gulp.dest('assets/css'))
  .pipe(browserSync.reload({stream:true}))
});

gulp.task('imagemin', function () {
  gulp.src('./assets/imgs/*')
  .pipe(imagemin({progressive:true}))
  .pipe(gulp.dest('_site/assets/imgs'))
});

// Watch scss files for changes & recompile, reload with BrowserSync
// Watch Jekyll source files, rebuild & reload with BrowserSync
gulp.task('watch', function () {
  gulp.watch('assets/sass/**/*', ['sass']);
  gulp.watch([
    'assets/imgs/**/*',
    'index*.html',
    '_config.yml',
    '_includes/*',
    '_layouts/*',
    '_posts/*'],
    ['jekyll-rebuild', browserSync.reload]);
  });

// Default Gulp task. Typing `gulp` will compile the sass,
// build the Jekyll site, launch BrowserSync & watch files
gulp.task('default', ['imagemin', 'browser-sync', 'watch']);
