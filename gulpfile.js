console.log('Node version: ' + process.version);

var gulp = require('gulp');

var sass = require('gulp-sass'); // sass plugin 
var browserSync = require('browser-sync').create(); // synchronised browser testing
var useref = require('gulp-useref'); // concatenate multiple js and css files into dist 
var uglify = require('gulp-uglify'); // minify	js
var cssnano = require('gulp-cssnano'); // minify css
var gulpIf = require('gulp-if'); // if a certain type of file
var imagemin = require('gulp-imagemin'); // trying to make image file sizes smaller
var cache = require('gulp-cache'); // only new images
var del = require('del'); // delete upon build
var runSequence = require('run-sequence'); // run when we want
var ghPages = require('gulp-gh-pages'); // eventual deploy to github
var fileinclude = require('gulp-file-include') // compile html partials

gulp.task('watch', ['browserSync', 'sass'], function(){
	gulp.watch('app/partials/*.html', ['fileinclude'])
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('sass', function(){
	return gulp.src('app/scss/**/*.scss')		//Globbing all files with .scss
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({		//reload browser as new html, css, js gets saved
			stream: true
		}))
});

gulp.task('browserSync', function(){	//sync to browser
	browserSync.init({
		server : {
			baseDir: 'app'
		},
	})
});

gulp.task('useref', function(){		//concatenates js/css into single file
	return gulp.src('app/*.html')
	.pipe(useref())
	.pipe(gulpIf('*.js', uglify()))		//only minify js
	.pipe(gulpIf('*.css', cssnano()))
	.pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
	return gulp.src('app/images/*.+(png|jpg|gif|svg)')		//optimize images
	.pipe(cache(imagemin({
		optimizationLevel: 12,
		progressive: true,
		interlaced: true
	})))
	.pipe(gulp.dest('dist/images'))
});

gulp.task('clean:dist', function(){		//clean dist
	return del.sync('dist');
});

gulp.task('build', function(callback){		//for 'gulp build'
	runSequence('clean:dist',
		['sass', 'useref', 'images', 'fonts'],
		callback
	)
});

gulp.task('fonts', function(){
	return gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))
});

gulp.task('default', function (callback) {		//'gulp'
	runSequence(['fileinclude', 'sass', 'browserSync', 'watch'],
		callback
	)
});

gulp.task('deploy', function() {		//deploys to github
	return gulp.src('./dist/**/*')
		.pipe(ghPages());
});

gulp.task('deploy-build', function(callback) {
	runSequence('build', ['deploy'],
		callback
	)
});

gulp.task('fileinclude', function() {		//partials
	gulp.src(['./app/partials/index.html'])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('./app'));
});