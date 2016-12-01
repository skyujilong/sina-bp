/**
 * @auth jilong5 <jilong5@staff.sina.com.cn> 2016年11月29日14:35:58
 * dev-server的配置选项
 */
'use strict';
let path = require("path");
module.exports = (isDev) => {
    if (!isDev) {
        return null;
    }
    return {
        contentBase: path.resolve(__dirname, '..', 'pages', 'js', 'page'),
        filename: "js/[name].js",
        hot: true,
        inline: false,
        historyApiFallback: false,
        lazy: false,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        publicPath: '/',
        headers: {
            "X-Custom-Header": "yes"
        },
        stats: {
            colors: true
        },
        quiet: true
    };
}
