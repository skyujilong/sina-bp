'use strict';
//热部署相关代码
const config = require('../config.js');
const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const spritePlugins = require('./sprite-plugins-config').plugins;
module.exports = {
    devtool: 'eval',
    module: {
        rules: [{
            test: /\.ts/,
            loader: 'ts-loader'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }, {
            // css资源
            test: /\.(scss|css)$/,
            use: ['style-loader?sourceMap', 'css-loader?sourceMap', 'postcss-loader?sourceMap=inline', 'sass-loader']
        }, {
            // 图片资源
            test: /\.(png|jpeg|jpg|gif)$/,
            loader: 'url-loader',
            options: {
                limit: 1,
                name: 'img/[name].[ext]'
            }
        }, {
            // html资源
            test: /\.html$/,
            loader: 'html-loader',
            options: {
                minimize: false,
                interpolate: true
            }
        }, {
            test: /\.tpl$/,
            loader: 'html-loader',
            options: {
                minimize: false,
                interpolate: false
            }
        }]
    },
    output: {
        path: path.resolve(__dirname, '..', 'test'),
        filename: 'js/[name].js',
        publicPath: config.publicPath
    },
    optimization: {
        splitChunks: {
            //js默认最大初始化并行请求数字
            maxInitialRequests: 4,
            chunks: 'initial'
        },
        runtimeChunk: {
            name: "manifest"
        },
        namedChunks: false
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new OpenBrowserPlugin({
            url: 'http://{{{bpConf.devHost}}}/',
            browser: 'google chrome'
        })
    ].concat(spritePlugins)
};