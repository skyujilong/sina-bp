/**
 * @auth jilong5 <jilong5@staff.sina.com.cn> 2016年11月29日13:56:14
 * 根据需求转化html的映射
 */
'use strict';
let glob = require('glob');
let path = require("path");
let HtmlWebpackPlugin = require('html-webpack-plugin');
/**
 * 扫描生成对应的html文件
 * @param  {Object} entryObj 入口文件的对象
 * @return {Array}           返回htmlplugin的实例
 */
module.exports = (entryObj) => {
    let htmlDir = path.resolve(__dirname, '..', 'pages', 'html');
    console.log(htmlDir);
    let entryHtml = glob.sync(htmlDir + '/*.html');
    let r = [];
    entryHtml.forEach((filePath) => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        let conf = {
            template: filePath,
            filename: filename + '.html'
        };
        if (filename in entryObj) {
            conf.inject = 'body';

            conf.chunks = ['manifest', 'vendor', filename];
            //确保顺序为 manifest vendor filename
            conf.chunksSortMode = function(a, b) {

                let chunkA = a.names[0];
                let chunkB = b.names[0];
                //当A B 为manifest 与 vendor的时候
                if (/^(manifest|vendor)/.test(chunkA) && /^(manifest|vendor)/.test(chunkB)) {
                    if (/^manifest/.test(chunkA)) {
                        return -1;
                    }
                    if (/^manifest/.test(chunkB)) {
                        return 1;
                    }
                    return 0;
                }

                if (/^(manifest|vendor)/.test(chunkA)) {
                    return -1;
                }

                if (/^(manifest|vendor)/.test(chunkB)) {
                    return 1;
                }

                return 0;
            };
        }
        //读取配置文件添加 不同的entryObj
        r.push(new HtmlWebpackPlugin(conf))
    });
    return {
        plugins: r
    };
};
