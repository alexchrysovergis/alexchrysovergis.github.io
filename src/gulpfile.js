const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const ts = require('gulp-typescript');

const paths = {
    scss: './scss/*.scss',
    cssDest: './../htdocs/dist/css/',
    ts: './ts/*.ts',
    js: './js/*.js', 
    jsDest: './../htdocs/dist/js/'
};

function css() {
    return src(paths.scss)
        .pipe(sass())
        .pipe(concat('styles.min.css'))
        .pipe(cleanCSS())
        .pipe(dest(paths.cssDest));
}

function compileTs() {
    const tsProject = ts.createProject('tsconfig.json');
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(dest('js'));
}

function js() {
    return src([
        'node_modules/@popperjs/core/dist/umd/popper.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/swiper/swiper-bundle.min.js',
        paths.js
    ])
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(dest(paths.jsDest));
}

function watchFiles() {
    watch(paths.scss, css);
    watch(paths.ts, series(compileTs, js));
    watch(paths.js, js);
}

exports.css = css;
exports.compileTs = compileTs;
exports.js = js;
exports.watch = watchFiles;

exports.default = series(css, compileTs, js, watchFiles);