/**
 * @auth jilong5 <jilong5@staff.sina.com.cn> 2016年11月29日13:56:08
 * 扫描目标节点，根据需要转化成对应的内容
 */
'use strict';
let glob = require('glob');
let path = require("path");
module.exports = {
    /**
     * 扫描入口文件
     * @param  {String} srcDir 扫描的地址
     * @return {Object}        返回扫描结果对象key值为入口文件的名字，value值为当前文件的绝对地址
     */
    scanEntry: (srcDir) => {
        let jsDir = path.resolve(srcDir, 'js', 'page');
        let entryFiles = glob.sync(jsDir + '/*.js');
        let map = {};
        entryFiles.forEach((filePath) => {
            let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
            map[filename] = filePath
        });
        return map;
    },
    transform: (isDev, entryObj) => {
        let addr = '127.0.0.1',
            port = '80';
        if (!isDev) {
            return entryObj;
        }
        // 添加 webpack监听属性
        Object.keys(entryObj).forEach((key) => {
            if (Object.prototype.toString.call(entryObj[key]) === '[object String]') {
                entryObj[key] = [
                    'webpack/hot/dev-server',
                    'webpack-dev-server/client?http://' + addr + ':' + port,
                    entryObj[key]
                ];
            }else if(Object.prototype.toString.call(entryObj[key]) === '[object Array]'){
                entryObj[key].unshift('webpack/hot/dev-server',
                'webpack-dev-server/client?http://' + addr + ':' + port);
            }
        });
        return entryObj;
    }
}
