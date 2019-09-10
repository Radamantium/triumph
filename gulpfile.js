'use strict';

const gulp          = require('gulp');
const gulpIf        = require('gulp-if');
const postcss       = require('gulp-postcss');
const del           = require('del');
const browserSync   = require('browser-sync').create();
const webpack       = require('webpack-stream');
const sass          = require('gulp-sass');


gulp.task('html', function() {
  return gulp.src('./dev/index.html', {since: gulp.lastRun('html')})
    .pipe(gulp.dest('./prod'));
});

gulp.task('scripts:dev', function() {
  // let webpackConfig = {
  //   output: {
  //     filename: 'js/main.js'
  //   },
  //   module: {
  //     rules: [
  //       {
  //         test: /\.js$/,
  //         loader: 'babel-loader',
  //         exclude: '/node_modules/'
  //       }
  //     ]
  //   },
  //   mode: 'development',
  //   devtool: 'source-map'
  // }

  return gulp.src('./dev/js/main.js')
    // .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./prod/js'));
});

gulp.task('scripts:prod', function() {
  let webpackConfig = {
    output: {
      filename: 'js/main.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules/'
        }
      ]
    },
    mode: 'production',
    devtool: 'none'
  }

  return gulp.src('./dev/js/main.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./prod'));
});

gulp.task('styles:dev', function() {
  return gulp.src('./dev/css/main.css')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./prod/css'));
});

gulp.task('styles:prod', function() {
  return gulp.src('./dev/css/main.css')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      // require('postcss-import'),
      require('postcss-url')({ url: 'rebase' }),
      require('autoprefixer')({}),
      require('cssnano')
    ]))
    .pipe(gulp.dest('./prod/css'));
});

gulp.task('clean', function() {
  return del('./prod');
});

gulp.task('build:dev', 
  gulp.series(
    'clean', 
    gulp.parallel('html', 'scripts:dev', 'styles:dev')
  )
);

gulp.task('build:prod', 
  gulp.series(
    'clean', 
    gulp.parallel('html', 'scripts:prod', 'styles:prod')
  )
);

gulp.task('watch', function(){
  gulp.watch('dev/index.html', gulp.series('html'));
  gulp.watch('dev/js/**/*',    gulp.series('scripts:dev')); 
  gulp.watch('dev/css/**/*',   gulp.series('styles:dev'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: 'prod'
  });
  browserSync.watch('prod/**/*.*')
    .on('change', browserSync.reload);
});

gulp.task('dev', 
  gulp.series(
    'build:dev', 
    gulp.parallel('watch', 'serve')
  )
);