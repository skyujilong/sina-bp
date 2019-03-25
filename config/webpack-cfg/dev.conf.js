// dev开发基础模式
'use strict'
const path = require('path');
const config = require('../config.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackEntryPlugin = require('html-webpack-entry-plugin');
module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
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
            use: [{
                    loader: MiniCssExtractPlugin.loader,
                },
                {
                    loader: "css-loader"
                },
                {
                    loader: "postcss-loader"
                },
                {
                    loader: "sass-loader"
                }
            ]
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
            //采用mustache进行配置文件。
            test: /\.tpl$/,
            loader: 'html-loader',
            options: {
                minimize: false,
                interpolate: false
            }
        }]
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
    output: {
        path: path.resolve(__dirname, '..', 'test'),
        filename: 'js/[name].js',
        publicPath: config.publicPath
    },
    plugins: [
        new CleanWebpackPlugin(['test'], {
            root: path.resolve(__dirname, '..')
        }),
        new HtmlWebpackEntryPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[name].css',
        }),
        new OpenBrowserPlugin({
            url: 'http://{{{devHost}}}/',
            browser: 'google chrome'
        })
    ]
};