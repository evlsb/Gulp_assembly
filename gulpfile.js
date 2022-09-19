const gulp          = require('gulp');
const less          = require('gulp-less');
const rename        = require('gulp-rename');
const cleanCSS      = require('gulp-clean-css');
const babel         = require('gulp-babel');
const uglify        = require('gulp-uglify');
const concat        = require('gulp-concat');
const del           = require('del');

const path = {
    styles: {
        src: 'src/styles/**/*.less',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    }
}

function clean(){
    return del(['dist']);
}

//Функция обработки стилей
function styles(){
    return gulp.src(path.styles.src)
            .pipe(less())
            .pipe(cleanCSS())
            .pipe(rename({
                basename: 'main',
                suffix: '.min'
            }))
            .pipe(gulp.dest(path.styles.dest))
}

//Функция обработки скриптов
function scripts(){
    return gulp.src(path.scripts.src,{
        sourcemaps: true
    })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(path.scripts.dest))
}

function watch(){
    gulp.watch(path.styles.src, styles)
    gulp.watch(path.scripts.src, scripts)
}


const build = gulp.series(clean, gulp.parallel(styles, scripts) , watch)

exports.clean   = clean;
exports.styles  = styles;
exports.scripts = scripts;
exports.watch   = watch;
exports.build   = build;

exports.default = build;