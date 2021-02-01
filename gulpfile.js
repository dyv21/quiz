const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sync = require('browser-sync').create();
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const gulpWebp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const del = require('del');

// Styles

const styles = () => {
  return gulp
    .src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css/'))
    .pipe(sync.stream());
};

exports.styles = styles;

// Images

const images = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg}').pipe(
    imagemin([
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
      }),
    ])
  );
};
exports.images = images;

const webp = () => {
  return gulp
    .src('source/img/**/*.{jpg,png}')
    .pipe(gulpWebp({ quality: 90 }))
    .pipe(gulp.dest('build/img'));
};
exports.webp = webp;

const sprite = () => {
  return gulp.src('source/img/**/*.svg').pipe(svgstore()).pipe(rename('sprite.svg')).pipe(gulp.dest('build/img'));
};
exports.sprite = sprite;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build/',
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};
exports.server = server;

// Copy

const copy = () => {
  return gulp
    .src(['source/fonts/*.{woff,woff2}', 'source/img/**'], {
      base: 'source/',
    })
    .pipe(gulp.dest('build'));
};

exports.copy = copy;

// Clean

const clean = () => {
  return del('build');
};

exports.clean = clean;

//html copy

const copyHtml = () => {
  return gulp
    .src(['source/*.html'], {
      base: 'source/',
    })
    .pipe(gulp.dest('build'));
};

exports.copyHtml = copyHtml;

//js copy

const copyJs = () => {
  return gulp
    .src(['source/js/*.js'], {
      base: 'source/',
    })
    .pipe(gulp.dest('build'));
};

exports.copyJs = copyJs;

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html', gulp.series(copyHtml));
  gulp.watch('source/js/*.js', gulp.series(copyJs));
  gulp.watch('source/*.html').on('change', sync.reload);
};

exports.build = gulp.series(clean, copy, copyHtml, copyJs, styles, images, webp, sprite);

exports.start = gulp.series(exports.build, server, watcher);
