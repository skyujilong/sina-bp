/**
 * @auth jilong5 <jilong5@staff.sina.com.cn> 2016年11月29日13:57:25
 * webpack的配置文件
 */
"use strict";
let path = require("path");
let srcDir = path.resolve(process.cwd(), 'pages');
let assets = path.resolve(process.cwd(), 'assets');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let autoprefixer = require('autoprefixer');
let postcssOpacity = require('postcss-opacity');
let colorRgbaFallback = require("postcss-color-rgba-fallback");
let entryHandler = require('./webpack-cfg/entry-handler.js');
let htmlPluginHandler = require('./webpack-cfg/html-plugins-handler.js');
let getDevServerConfig = require('./webpack-cfg/dev-server.js');

const dev = 'development';
let mode = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'production';
let entryObj = entryHandler.scanEntry(srcDir);
let htmlPlugins = htmlPluginHandler(srcDir, entryObj);
let getPlugins = require('./webpack-cfg/plugins.js');
let cssName = dev === mode ? 'css/[name].css' : 'css/[name]-[contenthash].css';
let cssExtractTextPlugin = new ExtractTextPlugin(cssName, {
    disable: false,
    allChunks: false //不将所有的文件都打包到一起
});

module.exports = {
    devtool: dev === mode ? '#source-map' : null,
    context: path.join(__dirname, 'pages', 'js', 'page'),
    entry: Object.assign(entryHandler.transform(dev === mode, entryObj), {
        'vender': ['es5-shim', 'es5-sham']
    }),
    output: {
        path: assets,
        publicPath: dev === mode ? "http://test.sina.com.cn/" : "https://snews.sinaimg.cn/projects/mq/",
        chunkFilename: dev === mode ? "js/[name]-chunk.js" : "js/[name]-chunk-[chunkhash].js",
        filename: dev === mode ? "js/[name].js" : "js/[name]-[chunkhash].js"
    },
    resolve: {
        root: [path.join(__dirname, 'pages')],
        extensions: ['', '.js', '.tpl', '.css', '.scss'],
        modulesDirectories: ['tpl', 'css', 'components', 'node_modules'],
        alias: {
            'es5-shim': path.join(__dirname, 'node_modules', 'es5-shim', 'es5-shim.min.js'),
            'es5-sham': path.join(__dirname, 'node_modules', 'es5-shim', 'es5-sham.min.js')
        }
    },
    module: {
        loaders: [{
                test: /\.(css|scss)$/,
                loader: mode === dev ? 'style!css?sourceMap!postcss-loader?sourceMap=inline!sass?sourceMap' : cssExtractTextPlugin.extract('style', ['css!postcss-loader!sass'])
            }, {
                test: /\.(png|jpeg|jpg|gif)$/,
                loader: 'url?limit=8192&name=img/[name]-[hash].[ext]'
            }, //图片加载对象
            {
                test: /\.tpl$/,
                loader: 'tmodjs'
            }, {
                test: /\.html$/,
                loader: 'html?minimize=false&interpolate=true'
            }
        ],
        noParse: [/zepto\.main\.js/, /es5-shim\.min\.js/, /es5-sham\.min\.js/]
    },
    devServer: getDevServerConfig(mode === dev),
    plugins: getPlugins(mode === dev, htmlPlugins, cssExtractTextPlugin),
    // postcss配置
    postcss: () => {
        return [
            //为ie浏览器添加opactity filter
            postcssOpacity(),
            //自动添加前缀
            autoprefixer({
                browsers: ['>1%']
            }),
            //将rgba转化成对应ie浏览器也能解析的filter
            colorRgbaFallback({
                oldie: true
            })
        ];
    }
};
