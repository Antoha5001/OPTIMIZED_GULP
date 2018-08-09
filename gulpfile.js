var gulp 				= require('gulp'),
sass 				= require('gulp-sass'),
		browserSync = require('browser-sync'),
		concat 			= require('gulp-concat'),
		uglifyJs 		= require('gulp-uglifyjs'),
		cssnano			= require('gulp-cssnano'),
		rename			= require('gulp-rename'),  
		del					= require('del'),  
		imagemin		= require('gulp-imagemin'),  
		pngquant		= require('imagemin-pngquant'),  
		cache				= require('gulp-cache'),  
		autoprefixer				= require('gulp-autoprefixer');  

		const srv = 'optimized-gulp.web:82';

function defaultTask() {
  
	gulp.task('browser-sync',  function () {
		browserSync.init({
			/*server: {
				baseDir: '500303_GULP'
			},*/
			proxy:srv,
			notify: false
			// tunnel: true,
			// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
		});
		browserSync.watch('app',browserSync.reload);
	});
  
}

exports.default = defaultTask;



gulp.task('watch', function () {

        gulp.watch('app/scss/**/*.scss',gulp.series('sass'));
        gulp.watch('app/script/**/*.js', gulp.series('js'));

        gulp.watch('app/**/*.php').on('change', browserSync.reload);
        gulp.watch('app/**/*.html').on('change', browserSync.reload);
    });

// gulp.task('default', gulp.parallel('watch','browser-sync'));