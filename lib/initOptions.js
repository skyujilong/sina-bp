'use strict';
const co = require('co');
//初始化默认配置信息
let argv = require('optimist').default({
    'dir': '',//生成路径地址 可空
    'name':'',//项目名称 可空
    'conf':'',//配置文件路径地址 可空
    'devPubilcPath': 'http://test.sina.com.cn/', //可空
    'onLinePublicPath': 'http://test.sina.com.cn/'// 可空
}).argv;

/**
 * 初始化 配置文件信息
 * @return {Object} 返回配置文件
 */
module.exports = function(){
    return co(function*(){

    });
};
