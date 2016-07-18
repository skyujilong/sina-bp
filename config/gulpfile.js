/**
 * Created by sina on 2016/5/19.
 */
'use strict';
let gulp = require('gulp');
let webpack = require('webpack');
let clean = require('gulp-clean');
let path = require('path');
let gutil = require('gulp-util');
gulp.task('default', ['bulid']);
gulp.task('clean', function () {
    gulp.src(path.join(__dirname, 'assets'))
        .pipe(clean());
});
gulp.task('clean-test', function () {
    gulp.src(path.join(__dirname, 'test'))
        .pipe(clean());
});
gulp.task('bulid', ['publish-img'], function (done) {
    let webpackConfig = require('./webpack.config.js')();
    webpack(webpackConfig, (err, stats) => {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({colors: true}));
        done();
    });
});

gulp.task('dev-bulid', ['dev-publish-img'], (done)=> {
    let webpackConfig = require('./webpack.config.js')(true);
    webpackConfig.watch = true;
    webpack(webpackConfig, (err, stats) => {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({colors: true}));
    })
});

gulp.task('dev-publish-img',['clean'],()=>{
    gulp.src(path.join(__dirname,'pages','outer-img','*.*'))
        .pipe(gulp.dest(path.join(__dirname,'test/outer-img')));
});
gulp.task('publish-img',['clean'],()=>{
    console.log(path.join(__dirname,'pages','outer-img','*.*'));
    gulp.src(path.join(__dirname,'pages','outer-img','*.*'))
        .pipe(gulp.dest(path.join(__dirname,'assets/outer-img')));
});