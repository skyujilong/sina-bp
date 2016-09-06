/**
 * Created by sina on 2016/5/16.
 */
"use strict";
let path = require("path");
let glob = require('glob');
let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let SpritesmithPlugin = require('webpack-spritesmith');
let srcDir = path.resolve(process.cwd(), 'pages');
let assets = path.resolve(process.cwd(), 'assets');
let testDir = path.resolve(__dirname, "test");
let autoprefixer = require('autoprefixer');
let postcssOpacity = require('postcss-opacity');
let colorRgbaFallback = require("postcss-color-rgba-fallback");

let spritePlugin = new SpritesmithPlugin({
    src: {
        cwd: path.resolve(__dirname, 'pages/sprite'),
        glob: '*.*'
    },
    target: {
        image: path.resolve(__dirname, 'pages/img/sprite.png'),
        css: path.resolve(__dirname, 'pages/css/sprite.scss')
    },
    apiOptions: {
        cssImageRef: "../img/sprite.png"
    },
    spritesmithOptions: {
        padding: 30,
        algorithm: "alt-diagonal"
    }
});

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
let htmlPlugins = (() => {
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
module.exports = ((isDev) => {
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
            path: isDev ? testDir : assets,
            publicPath: isDev ? "/test/" : "https://snews.sinaimg.cn/projects/mq/",
            chunkFilename: isDev ? "js/[name]-chunk.js" : "js/[name]-chunk-[chunkhash].js",
            filename: isDev ? "js/[name].js" : "js/[name]-[chunkhash].js"
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
                // {
                //     test: /\.css/,
                //     loader: isDev ? 'style!css' : cssExtractTextPlugin.extract('style', ['css'])
                // }, //css加载器 inline模式
                {
                    test: /\.scss$/,
                    loader: isDev ? 'style!css?sourceMap!postcss-loader?sourceMap=inline!sass?sourceMap' : cssExtractTextPlugin.extract('style', ['css!postcss-loader!sass'])
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
        plugins: (() => {
            let list = [new webpack.NoErrorsPlugin(),spritePlugin];
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
        })(),
        // postcss配置
        postcss: function() {
            return [
                //为ie浏览器添加opactity filter
                postcssOpacity(),
                //自动添加前缀
                autoprefixer({
                    browsers: ['ie > 6', 'last 10 Chrome versions', 'last 10 Firefox versions', 'last 10 Opera versions']
                }),
                //将rgba转化成对应ie浏览器也能解析的filter
                colorRgbaFallback({
                    oldie:true
                })
            ];
        }
    };
});
