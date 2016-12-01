/**
 * @auth jilong5 <jilong5@staff.sina.com.cn> 2016年11月29日14:40:36
 * 初始化对应的plugin组件
 */
'use strict';
let path = require("path");
let SpritesmithPlugin = require('webpack-spritesmith');
let webpack = require('webpack');
let DashboardPlugin = require('webpack-dashboard/plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');

let spritePlugin = new SpritesmithPlugin({
    src: {
        cwd: path.resolve(__dirname, '..', 'pages/sprite'),
        glob: '*.*'
    },
    target: {
        image: path.resolve(__dirname, '..', 'pages/img/sprite.png'),
        css: path.resolve(__dirname, '..', 'pages/css/sprite.scss')
    },
    apiOptions: {
        cssImageRef: "../img/sprite.png"
    },
    spritesmithOptions: {
        padding: 30,
        algorithm: "alt-diagonal"
    }
});

/**
 * 输出plugin list内容
 * @param  {Boolean} isDev       [description]
 * @param  {Array}  htmlPlugins  HTML的相关组件实例
 * @param  {Object} cssPlugin    CSS相关的组件实例
 * @return {Array}              [description]
 */
module.exports = (isDev, htmlPlugins, cssPlugin) => {
    let list = [new webpack.NoErrorsPlugin(), spritePlugin, cssPlugin].concat(htmlPlugins);
    if (isDev) {
        list = list.concat([
            new webpack.HotModuleReplacementPlugin()
            // new DashboardPlugin({
            //     port: 9003
            // })
        ]);
    } else {
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
    }
    return list;
};
