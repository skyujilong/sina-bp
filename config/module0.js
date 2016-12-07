'use strict';
const config = require('../config.js');

module.exports = (enableSourceMap, cssExtractTextPlugin) => {
    return {
        loaders: [{
                test: /\.(css|scss)$/,
                loader: enableSourceMap ? cssExtractTextPlugin.extract('style','css?sourceMap!postcss-loader?sourceMap=inline!sass') : cssExtractTextPlugin.extract('style', ['css!postcss-loader!sass'])
            }, {
                test: /\.(png|jpeg|jpg|gif)$/,
                // loader: 'url?limit=1&name=img/[name]-[hash].[ext]'
                loader: 'url?limit=1&name=img/' + (config.md5 ? '[name]-[hash:6].[ext]' : '[name].[ext]')
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
    };
};
