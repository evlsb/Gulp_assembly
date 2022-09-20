const gulp          = require('gulp');
const less          = require('gulp-less');
const rename        = require('gulp-rename');
const cleanCSS      = require('gulp-clean-css');
const babel         = require('gulp-babel');
const uglify        = require('gulp-uglify');
const concat        = require('gulp-concat');
const sourcemaps    = require('gulp-sourcemaps');
const autoprefixer  = require('gulp-autoprefixer');
const imagemin      = require('gulp-imagemin');
const htmlmin       = require('gulp-htmlmin');
const size          = require('gulp-size');
const newer         = require('gulp-newer');
const browsersync   = require('browser-sync').create();
const gulppug       = require('gulp-pug');
const sass          = require('gulp-sass')(require('sass'));
const ts            = require('gulp-typescript');
const del           = require('del');

const path = {
    pug: {
        src: 'src/*.pug',
        dest: 'dist/'
    },
    html: {
        src: 'src/*.html',
        dest: 'dist/'
    },
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    },
    images: {
        src: 'src/img/**',
        dest: 'dist/img/'
    }
}

function clean(){
    return del(['dist/*', '!dist/img']);
}

function pug(){
    return gulp.src(path.pug.src)
      .pipe(gulppug())
      .pipe(size({
        showFiles: true
    }))
      .pipe(gulp.dest(path.pug.dest))
      .pipe(browsersync.stream())
}

function html(){
    return gulp.src(path.html.src)
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(size({
        showFiles: true
    }))
      .pipe(gulp.dest(path.html.dest))
      .pipe(browsersync.stream())
}

//Функция обработки стилей
function styles(){
    return gulp.src(path.styles.src)
            .pipe(sourcemaps.init())
            //.pipe(less())
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({
                cascade: false
            }))
            .pipe(cleanCSS({
                level: 2
            }))
            .pipe(rename({
                basename: 'main',
                suffix: '.min'
            }))
            .pipe(sourcemaps.write('.'))
            .pipe(size({
                showFiles: true
            }))
            .pipe(gulp.dest(path.styles.dest))
            .pipe(browsersync.stream())
}

//Функция обработки скриптов
function scripts(){
    return gulp.src(path.scripts.src,{
        sourcemaps: true
    })
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(size({
        showFiles: true
    }))
    .pipe(gulp.dest(path.scripts.dest))
    .pipe(browsersync.stream())
}

function img(){
    return gulp.src(path.images.src)
            .pipe(newer(path.images.dest))
		    .pipe(imagemin({
                progressive: true
            }))
            .pipe(size({
                showFiles: true
            }))
		    .pipe(gulp.dest(path.images.dest))
}

function watch(){
    browsersync.init({
        server: {
            baseDir: "./dist/"
        }
    })
    gulp.watch(path.html.dest).on('change', browsersync.reload);
    gulp.watch(path.styles.src, styles)
    gulp.watch(path.scripts.src, scripts)
    gulp.watch(path.images.src, img)
    gulp.watch(path.html.src, html)
    
}


const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img, html), watch);

exports.clean   = clean;
exports.img     = img;
exports.html    = html;
exports.pug     = pug;
exports.styles  = styles;
exports.scripts = scripts;
exports.watch   = watch;
exports.build   = build;

exports.default = build;