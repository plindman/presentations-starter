// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');

// CLEAN tasks
gulp.task('clean', function() {
    gulp.src('./dist/*')
      .pipe(clean({force: true}));
	gulp.src('./app/js/app-bundle.js')
      .pipe(clean({force: true}));
});

// DEV / BUILD tasks
gulp.task('init', function() {
	gulp.src('./app/js/app-bundle.js', {read: false})
      .pipe(clean({force: true}));
});

gulp.task('build-lint', function() {
  gulp.src(['./app/**/*.js', '!./app/js/app-bundle.js', '!./app/bower_components/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

/** TODO compile sass (or less) **/
// Compile Our Sass
/*
gulp.task('build-sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'));
});
*/

gulp.task('build-browserify', function() {
	gulp.src(['app/js/main.js'])
	.pipe(browserify({
		insertGlobals: true,
		debug: true
	}))
	.pipe(concat('app-bundle.js'))
	.pipe(gulp.dest('./app/js'))
	.pipe(connect.reload());
});

// Watch Files For Changes
// Todo - learn and understand better how this works, and make it work with connect.server.
gulp.task('build-watch', function() {
    gulp.watch(['app/js/**/*.js', '!app/js/app-bundle.js'], ['build-browserify']);
    //gulp.watch('scss/*.scss', ['sass']);
});

gulp.task('dev-connect', function () {
  connect.server({
    root: 'app/',
	livereload: true,
    port: 8888
  });
});

// DIST / PROD sub-tasks
gulp.task('dist-minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/'))
});
gulp.task('dist-minify-js', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
    .pipe(gulp.dest('./dist/'))
});
gulp.task('dist-bower-components', function () {
  gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
});
gulp.task('dist-html-files', function () {
  gulp.src('./app/**/*.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('dist-connect', function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});

// COMMAND-LINE TASKS
gulp.task('build', ['init', 'build-lint', 'build-browserify']);
gulp.task('dev', ['build', 'build-watch', 'dev-connect']);
gulp.task('dist', ['build', 'dist-minify-css', 'dist-minify-js', 'dist-html-files', 'dist-bower-components']);
gulp.task('prod', ['dist', 'dist-connect']);
gulp.task('default', ['dev']);

// build task
/*
gulp.task('build',
  ['lint', 'browserifyDist', 'copy-html-files', 'copy-bower-components', 'connectDist']
);
*//*
gulp.task('browserifyDist', function() {
  gulp.src(['app/js/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('bundled.js'))
  .pipe(gulp.dest('./dist/js'))
});
*/