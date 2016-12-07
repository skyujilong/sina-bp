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
 * @param  {String} srcDir   根路径
 * @param  {Object} entryObj 入口文件的对象
 * @return {Array}           返回htmlplugin的实例
 */
module.exports = (srcDir, entryObj) => {
    let htmlDir = path.resolve(srcDir, 'html');
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
            conf.chunks = ['vender', filename];
            conf.chunksSortMode = function(a,b){
                if(/^vender/.test(a.names[0])){
                    return -1;
                }
                if(/^vender/.test(b.names[0])){
                    return 1;
                }
                return 0;
            };
        }
        //读取配置文件添加 不同的entryObj
        r.push(new HtmlWebpackPlugin(conf))
    });
    return r;
};
