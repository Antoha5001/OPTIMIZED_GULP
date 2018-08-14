"use strict";

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    ftp = require('vinyl-ftp'),
    notify = require("gulp-notify"),
    gcmq = require("gulp-group-css-media-queries"),
    srv = 'project02.gr:82';

//Плагины
var jsLibs = [
    'app/script/jquery.min.js',
    'app/script/jquery.validate.min.js',
    'app/script/modernizr.js',
    'app/script/jquery.inputmask.bundle.min.js',
    'app/script/tingle.min.js',
    'app/script/flickity.pkgd.min.js',
    'app/script/bootstrap.min.js',
    'app/common/common.min.js'
];

var jsMy = [
    // 'app/script/modal.js',
    'app/script/parallax.js',
    'app/script/myscript.js'
];

//Собираем свои
gulp.task('common-js', function () {
    return gulp.src(jsMy)
        .pipe(concat('common.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/common'));
});

//Собираем плагины + свои сжатые
gulp.task('js', gulp.series('common-js', function () {
    return gulp.src(jsLibs)
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest('app/common'))
        .pipe(browserSync.reload({stream: true}));
}));

gulp.task('sass', function () {
    return gulp.src('app/scss/*.scss')
        .pipe(sass({outputStyle: 'expand'}).on("error", notify.onError({
            title: "sass"
        })))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(csso())
        .pipe(cssnano())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('app/css'));
        // .pipe(browserSync.reload({stream: true}));
});

gulp.task('css-libs', gulp.series('sass',function () {
    return gulp.src([
        // 'app/scss/_reset.css',
        // 'app/scss/flickity.css',
        // 'app/scss/normalize.css',
        'app/css/mystyle.css'])
        .pipe(cssnano())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream:true}));
}));


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

gulp.task('watch', function () {

        gulp.watch('app/scss/**/*.scss',gulp.series('sass'));
        gulp.watch('app/script/**/*.js', gulp.series('js'));

        gulp.watch('app/**/*.php').on('change', browserSync.reload);
        gulp.watch('app/**/*.html').on('change', browserSync.reload);
    });

gulp.task('default', gulp.parallel('watch','browser-sync'));
