/**
 * @auth jilong5 <jilong5@staff.sina.com.cn> 2016年11月29日14:40:36
 * 初始化对应的plugin组件
 */
'use strict';
const path = require("path");
const webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const spritePlugins = require('./sprite-plugins-config.js');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const config = require('../config.js');
/**
 * 输出plugin list内容
 * @param  {Boolean} mode       [description]
 * @param  {Array}  htmlPlugins  HTML的相关组件实例
 * @param  {Object} cssPlugin    CSS相关的组件实例
 * @return {Array}              [description]
 */
module.exports = (mode, htmlPlugins, cssPlugin) => {
    let list = [new webpack.NoErrorsPlugin(), cssPlugin].concat(htmlPlugins).concat(spritePlugins);
    if (mode === 'development') {
        list = list.concat([
            new webpack.HotModuleReplacementPlugin(),
            new OpenBrowserPlugin({url:config.publicPath}),
            new DashboardPlugin({
                port: 9003
            })
        ]);
    } else if (mode === 'production') {
        list = list.concat([
            // 压缩
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                output: {
                    comments: false
                },
                mangle: {
                    except: ['$', 'exports', 'require']
                }
            }),
            // 文件夹清理
            new CleanWebpackPlugin(['assets'], {
                root: path.resolve(__dirname, '..'),
                verbose: true
            })
        ]);
    } else if (mode === 'developmentIE') {
        list.push(
            new CleanWebpackPlugin(['test'], {
                root: path.resolve(__dirname, '..'),
                verbose: true
            }),
            new OpenBrowserPlugin({url:config.publicPath})
        );
    }
    return list;
};
