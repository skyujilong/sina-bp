/**
 * @auth jilong5 <jilong5@staff.sina.com.cn> 2016年11月29日13:56:08
 * 扫描目标节点，根据需要转化成对应的内容
 */
'use strict';
const glob = require('glob');
const path = require("path");
/**
 * 扫描入口文件
 * @return {Object}    返回扫描结果对象key值为入口文件的名字，value值为当前文件的绝对地址
 */
module.exports = {
    entry: (() => {
        let jsDir = path.resolve(__dirname, '..', 'pages', 'js', 'page');
        let entryFiles = glob.sync(jsDir + '/*.js');
        let map = {};
        entryFiles.forEach((filePath) => {
            let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
            map[filename] = filePath
        });
        return map;
    })()
}
