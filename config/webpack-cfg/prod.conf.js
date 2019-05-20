// dev开发基础模式
'use strict'
const path = require('path');
const config = require('./../config.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// 配置是否md5版本化
let cssName = config.md5 ? 'css/[name]-[contenthash:6].css' : 'css/[name].css';
let jsName = config.md5 ? 'js/[name]-[contenthash:6].js' : 'js/[name].js';
let imgName = config.md5 ? 'img/[name]-[hash:6].[ext]' : 'img/[name].[ext]';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const TinyPngWebpackPlugin = require('tinypng-webpack-plugin');
const HtmlWebpackEntryPlugin = require('html-webpack-entry-plugin');
const spritePlugins = require('./sprite-plugins-config').plugins;
module.exports = {
    mode: 'production',
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
                name: imgName,
                publicPath: config.onLineImgPublicPath
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
    output: {
        path: path.resolve(__dirname, '..', 'assets'),
        filename: jsName,
        publicPath: config.onLinePublicPath
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                sourceMap: true,
                cache: true,
                parallel: true,
                terserOptions: {
                    ecma:5,
                    ie8: true,
                    safari10: true,
                    mangle: {
                        reserved: ['$', 'exports', 'require']
                    },
                    output: {
                        comments: false
                    },
                    compress: {
                        warnings: false,
                        drop_console: true,
                        drop_debugger: true
                    }
                }
            })
        ],
        splitChunks: {
            //js默认最大初始化并行请求数字
            maxInitialRequests: 4,
            chunks: 'initial',
            // cacheGroups: {
            //     vendors: {
            //         name:'vendors',
            //         test: /[\\/]node_modules[\\/]/,
            //         priority: -10
            //     }
            // }
        },
        runtimeChunk: {
            name: "manifest"
        },
        namedChunks: true
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: cssName,
            chunkFilename: cssName,
        }),
        new OptimizeCSSAssetsPlugin({}),
        new CleanWebpackPlugin(['assets'], {
            root: path.resolve(__dirname, '..')
        }),
        //压缩本地图片的方法
        new TinyPngWebpackPlugin({
            key: config.tinyPngKeys
        }),
        new HtmlWebpackEntryPlugin()
    ].concat(spritePlugins)
};