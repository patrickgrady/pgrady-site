const child = require('child_process');
const browserSync = require('browser-sync').create();

const gulp = require('gulp');
const concat = require('gulp-concat');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');

const siteRoot = '_site';
const cssFiles = './assets/sass/*.scss';

// Compile Sass with gulp-sass (Node-Sass), autoprefix, & minify css
gulp.task('sass', function() {
  gulp.src('./assets/sass/**/*.?(s)css')
  .pipe(sourcemaps.init())
  .pipe(sass({
    errLogToConsole: true,
    outputStyle: 'compressed' }))
  .pipe(autoprefixer({browsers:['last 2 versions']}))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('_site/assets/css'))
  .pipe(rename('styles.css'))
  .pipe(gulp.dest('assets/css'))
  .pipe(browserSync.stream());
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    watch: true,
    port: 4000,
    server: {
      baseDir: siteRoot
    },
    xip: true, //your.computer's.ip.xip.io:port
    online: false
  });
  gulp.watch("./assets/sass/**/*.?(s)css", ['sass']);
  gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('default', ['sass', 'jekyll', 'serve']);
