var gulp 				= require('gulp'),  // инициализация, подключение модуля
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

gulp.task('sass', function () {
	return gulp.src('app/scss/*.scss') //берем какие-нибудь файлы, и возвращаем
				.pipe(sass()) // вызов како-то команды, плагина,
				.pipe(autoprefixer(['last 15 versions','> 1%','ie 8','ie 7'],{cascade:true}))
				.pipe(gulp.dest('app/css')) //выгружаем работу плагина
				.pipe(browserSync.reload({stream:true})) //инжектим css
}); // инструкция, задача
gulp.task('css-libs',['sass'], function(){
	return gulp.src(['app/css/libs.css','app/css/style.css'])
				.pipe(cssnano())
				.pipe(rename({suffix:'.min'}))
				.pipe(gulp.dest('app/css'));
});
gulp.task('scripts', function(){
	return gulp.src([
			'app/libs/jquery/dist/jquery.min.js',
			'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
		])
				.pipe(concat('libs.min.js'))
				.pipe(uglifyJs())
				.pipe(gulp.dest('app/script'))
});
gulp.task('browser-sync', function(){
	browserSync({
		server:{
			baseDir: 'app'
		},
		notify:false
	});
});
gulp.task('img', function(){
	return gulp.src('app/image/**/*')
					.pipe(cache(imagemin({		 //кешируем изображения и сжимаем
						interlaced:true,
						progressive:true,
						svgoPlugins:[{removeViewBox:false}],
						use:[pngquant()]
					})))
					.pipe(gulp.dest('dist/image'));
});
gulp.task('watch', ['browser-sync','css-libs','scripts'], function(){ //квадратные скобки выполнятся первыми, до задачи watch
	gulp.watch('app/scss/*.scss', ['sass']); //2 функция
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/script/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean','img','sass','scripts'],function(){
	var buildCss = gulp.src(['app/css/libs.min.css','app/css/style.min.css']).pipe(gulp.dest('dist/css')),
		 buildFonts = gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts')),
			buildJs	= gulp.src('app/script/**/*').pipe(gulp.dest('dist/script')),
			buildHtml = gulp.src('app/*.html').pipe(gulp.dest('dist'));

});
gulp.task('clean', function(){
	return del.sync('dist');
});
gulp.task('clear', function(){
	return cache.clearAll();
});