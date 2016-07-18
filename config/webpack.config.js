/**
 * Created by sina on 2016/5/16.
 */
"use strict";
let path = require("path");
let glob = require('glob');
let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');

let srcDir = path.resolve(process.cwd(), 'pages');
let assets = path.resolve(process.cwd(), 'assets');
//文件js扫描入口
let entries = (() => {
    let jsDir = path.resolve(srcDir, 'js', 'page');
    let entryFiles = glob.sync(jsDir + '/*.js');
    let map = {};
    entryFiles.forEach((filePath) => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        map[filename] = filePath
    });
    return map
})();
let htmlPlugins = (()=> {
    let htmlDir = path.resolve(srcDir, 'html');
    let entryHtml = glob.sync(htmlDir + '/*.html');
    let r = []

    entryHtml.forEach((filePath) => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        let conf = {
            template: filePath,
            filename: filename + '.html'
        };

        if (filename in entries) {
            conf.inject = 'body';
            conf.chunks = ['vender', filename]
        }
        //TODO 读取配置文件添加 不同的entries
        r.push(new HtmlWebpackPlugin(conf))
    });

    return r;
})();
module.exports = ((isDev)=> {
    let cssName = isDev ? 'css/[name].css' : 'css/[name]-[contenthash].css';
    let cssExtractTextPlugin = new ExtractTextPlugin(cssName, {
        disable: false,
        allChunks: false //不将所有的文件都打包到一起
    });

    return {
        //watch: isDev,
        devtool: isDev ? '#source-map' : null,
        entry: Object.assign(entries, {
            'vender': ['es5-shim', 'es5-sham', 'zepto']
        }),
        output: {
            path: isDev ? path.resolve(__dirname, "test") : path.resolve(__dirname, "assets"),
            publicPath:isDev ? "/test/" : "https://snews.sinaimg.cn/projects/mq/",
            chunkFilename: isDev ? "js/[name]-chunk.js" : "js/[name]-chunk-[hash].js",
            filename: isDev ? "js/[name].js" : "js/[name]-[hash].js"
        },
        resolve: {
            root: [path.join(__dirname, 'js', 'main')],
            extensions: ['', '.js', '.tpl', '.css'],
            modulesDirectories: ['tpl', 'css', 'components', 'node_modules'],
            alias: {
                'zepto': path.join(__dirname, 'pages', 'js', 'lib', 'core', 'zepto.min.js'),
                'es5-shim': path.join(__dirname, 'node_modules', 'es5-shim', 'es5-shim.min.js'),
                'es5-sham': path.join(__dirname, 'node_modules', 'es5-shim', 'es5-sham.min.js')
            }
        },
        module: {
            loaders: [
                //第一个参数 是当 不采用extract-text-plugin组件的时候 要用到的Loader
                {test: /\.css/, loader: isDev ? 'style!css' : cssExtractTextPlugin.extract('style', ['css'])},//css加载器 inline模式
                {test: /\.(png|jpeg|jpg|gif)$/, loader: 'url?limit=8192&name=img/[name]-[hash].[ext]'},//图片加载对象
                {test: /\.tpl$/, loader: 'tmodjs'},
                {test: /\.html$/, loader: 'html'}
            ],
            noParse: [/zepto\.main\.js/, /es5-shim\.min\.js/, /es5-sham\.min\.js/]
        },
        plugins: (()=> {
            let list = [new webpack.NoErrorsPlugin()];
            if (!isDev) {
                list.push(new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    },
                    output: {
                        comments: false
                    },
                    mangle: {
                        except: ['$', 'exports', 'require']
                    }
                }), cssExtractTextPlugin);
            }
            return list.concat(htmlPlugins);
        })()
    };
});