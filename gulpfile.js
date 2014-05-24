var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    minifyhtml = require('gulp-minify-html'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    concatcss = require('gulp-concat-css'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');
var config = require('./app/config.json');

gulp.task('styles-vender', function () {
    if (config.styles.length > 0) {
        return gulp.src(config.styles)
        .pipe(concatcss('vender.css'))
        .pipe(gulp.dest('app/assets/styles'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('app/assets/styles'))
        .pipe(notify({message: 'Styles-vender task complete'}));
    }
});
gulp.task('styles-main', function () {
    return gulp.src('app/styles/**/*.sass')
    .pipe(sass({style: 'expanded'}))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(concatcss('main.css'))
    .pipe(gulp.dest('app/assets/styles'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('app/assets/styles'))
    .pipe(notify({message: 'Styles-main task complete'}));
});
gulp.task('styles', function () {
    gulp.start('styles-vender', 'styles-main');
});
gulp.task('scripts-vender', function () {
    if (config.scripts.length > 0) {
        return gulp.src(config.scripts)
        .pipe(concat('vender.js'))
        .pipe(gulp.dest('app/assets/scripts'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('app/assets/scripts'))
        .pipe(notify({message: 'Scripts-vender task complete'}));
    }
});
gulp.task('scripts-main', function () {
    return gulp.src('app/scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('app/assets/scripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('app/assets/scripts'))
    .pipe(notify({message: 'Scripts-main task complete'}));
});
gulp.task('scripts', function () {
    gulp.start('scripts-vender', 'scripts-main');
});
gulp.task('images', function () {
    return gulp.src('app/images/**/*')
    .pipe(cache(imagemin({optimizationLevel: 3, progressive: true,interlaced: true})))
    .pipe(gulp.dest('app/assets/images'))
    .pipe(notify({message: 'Images task complete'}));
});
gulp.task('clean', function () {
    return gulp.src(['app/assets/styles', 'app/assets/scripts', 'app/assets/images'],{read: false})
    .pipe(clean());
});
gulp.task('watch', function () {
    gulp.watch('app/styles/**/*.sass', ['styles-main']);
    gulp.watch('app/scripts/**/*.js', ['scripts-main']);
    gulp.watch('app/config.json', ['styles-vender', 'scripts-vender']);
    gulp.watch('app/images/**/*', ['images']);
});
gulp.task('default', ['clean'], function () {
    gulp.start('styles', 'scripts', 'images');
});