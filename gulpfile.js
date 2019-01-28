
// import path from 'path';
const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', () =>
    gulp.src(path.resolve(__dirname, 'lib', 'test.js'))

    .pipe(babel({
        presets: ['@babel/preset-env']
    }))
    .pipe(gulp.dest(path.resolve(__dirname, 'dist')))
);