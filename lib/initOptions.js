'use strict';
const co = require('co');
const thunkfiy = require('thunkify');
const fs = require('fs');
const _ = require('lodash');
//初始化默认配置信息
let argv = require('optimist').default({
    'dir': '', //生成路径地址 可空
    'name': '', //项目名称 可空
    'conf': '', //配置文件路径地址 可空
    'devPubilcPath': 'http://test.sina.com.cn/', //可空
    'onLinePublicPath': 'http://test.sina.com.cn/' // 可空
}).argv;

/**
 * 根据cfgDir 返回对应的json对象
 * @param  {String}    cfgDir 路径地址
 * @return {Generator}        [description]
 */
function * readCfgFile(cfgDir) {
    let cfg = {
        'projectName':'',
        'workspace':'',
        'svn':'',
        'devHost':'',
        'onLineHost':'',
        'imgOnLineHost':'',
        'qbNewDir':''
    }
    let state = yield thunkfiy(fs.lstat)(cfgDir);
    if (!state.isFile()) {
        throw new Error('the params conf is not a file path！');
    }
    let cfgContent = yield thunkfiy(fs.readFile)(cfgDir, 'utf-8');
    cfgContent = trimCfg(cfgContent);
    initCfgArgs(cfgContent,cfg);
    return cfg;
}
/**
 * 通过cfgContent内容初始化cfgObj
 * @param  {[type]} cfgContent [description]
 * @param  {[type]} cfgObj     [description]
 * @return {[type]}            [description]
 */
function initCfgArgs(cfgContent, cfgObj){
    let lineReg = /\s*([^\n\r]+)(\n|\r)/g;
    let result;
    while( result = lineReg.exec(cfgContent)){
        //TODO 解析属性 ，init cfgObj
        let _r = result[1].match(/([^:]+):(.*)/);
        if(_r){
            cfgObj[_.trim(_r[1],'\'"')] = _.trim(_r[2],'\'"');
        }
    }
}


/**
 * 字符串过滤
 * @param  {[type]} cfgContent [description]
 * @return {[type]}            [description]
 */
function trimCfg(cfgContent){
    //清理{}括号
    cfgContent = cfgContent.replace(/(.*{\s+)|(})/g,'');
    //清理 注释文案
    cfgContent = cfgContent.replace(/([,\r\n]|\s+)\/\/.*/g,'');
    cfgContent = cfgContent.replace(/(['"])\/\/.*/g,'$1');
    cfgContent = cfgContent.replace(/\/\*[\s\S]*\*\//g,'');
    //清理 前后的空白
    cfgContent = _.trim(cfgContent);
    return cfgContent;
}

/**
 * 初始化 配置文件信息
 * @return {Object} 返回配置文件
 */
module.exports = function() {
    return co(function * () {
        let cfg = {};
        if (!!argv.conf) {
            // yield
            let _cfg = yield readCfgFile(argv.conf);
            cfg = Object.assign(cfg,_cfg);
        }
        return cfg;
    });
};
