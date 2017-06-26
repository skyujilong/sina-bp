'use strict';
const co = require('co');
const thunkfiy = require('thunkify');
const fs = require('fs');
const path = require('path');
const os = require('os');
const _ = require('lodash');
//初始化默认配置信息
let argv = require('optimist').default({
    'dir': '', //生成路径地址 可空
    'name': '', //项目名称 可空
    'conf': '', //配置文件路径地址 可空
    'devHost': 'http://test.sina.com.cn/', //可空
    'onLineHost': 'http://test.sina.com.cn/', // 可空
    'imgOnLineHost': 'http://test.sina.com.cn/' //可空
}).argv;

const _cfg = {
    'name': '', //项目名称
    'workspace': '', //项目目录
    'svn': '', //svn地址
    'devHost': '', // 开发环境资源路径
    'onLineHost': '', //线上资源路径
    'imgOnLineHost': '', //线上图片资源路径
    'qbNewDir': '' //qb相关新增路径，该字段选填，要是没有，不生成qb.html文件
}

/**
 * 根据cfgDir 返回对应的json对象
 * @param  {String}    cfgDir 路径地址
 * @return {Generator}        [description]
 */
function * readCfgFile(cfgDir) {
    if (path.isAbsolute(cfgDir)) {
        cfgDir = transformDir(cfgDir);
    } else {
        cfgDir = path.resolve(process.cwd(), cfgDir);
    }
    let cfg = Object.assign({}, _cfg);
    let state = yield thunkfiy(fs.lstat)(cfgDir);
    if (!state.isFile()) {
        throw new Error('the params conf is not a file path！');
    }
    let cfgContent = yield thunkfiy(fs.readFile)(cfgDir, 'utf-8');
    cfgContent = trimCfg(cfgContent);
    initCfgArgs(cfgContent, cfg);
    return cfg;
}
/**
 * 通过cfgContent内容初始化cfgObj
 * @param  {[type]} cfgContent [description]
 * @param  {[type]} cfgObj     [description]
 * @return {[type]}            [description]
 */
function initCfgArgs(cfgContent, cfgObj) {
    let lineReg = /\s*([^\n\r]+)(\n|\r)/g;
    let result;
    while (result = lineReg.exec(cfgContent)) {
        //TODO 解析属性 ，init cfgObj
        let _r = result[1].match(/([^:]+):(.*)/);
        if (_r && cfgObj[_.trim(_r[1], '\'"')] === '') {
            cfgObj[_.trim(_r[1], '\'"')] = _.trim(_r[2], '\'"');
        }
    }
}

/**
 * 字符串过滤
 * @param  {[type]} cfgContent [description]
 * @return {[type]}            [description]
 */
function trimCfg(cfgContent) {
    //清理{}括号
    cfgContent = cfgContent.replace(/(.*{\s+)|(})/g, '');
    //清理 注释文案
    cfgContent = cfgContent.replace(/([,\r\n]|\s+)\/\/.*/g, '');
    cfgContent = cfgContent.replace(/(['"])\/\/.*/g, '$1');
    cfgContent = cfgContent.replace(/\/\*[\s\S]*\*\//g, '');
    //清理 前后的空白
    cfgContent = _.trim(cfgContent);
    return cfgContent;
}

/**
 * 转换在win控制台下 输入/d/workspace这种linux路径 转化为对应平台的路径
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */
function transformDir(dir) {
    if (os.platform() !== 'win32') {
        return dir;
    }
    let returnDir = '';
    if (/^\//.test(dir)) {
        let dirList = dir.split('/');
        _.each(dirList, (item,index) => {
            if(index === 0){
                return;
            }
            if(index === 1){
                returnDir += (item + ':');
            }else{
                returnDir += ('\\' + item);
            }
        });
        return returnDir;
    }else{
        return dir;
    }
}

/**
 * 初始化 配置文件信息
 * @return {Object} 返回配置文件
 */
module.exports = function() {
    return co(function * () {
        let cfg = Object.assign(_cfg);
        if (argv.conf !== '') {
            // yield
            let _cfg = yield readCfgFile(argv.conf);
            cfg = Object.assign(cfg, _cfg);
            //没有初始化 采用备用的
            if (!cfg.devHost) {
                cfg.devHost = argv.devHost;
            }
            if (!cfg.onLineHost) {
                cfg.onLineHost = argv.onLineHost;
            }
            if (!cfg.imgOnLineHost) {
                cfg.imgOnLineHost = argv.imgOnLineHost;
            }
        }
        //同时存在 name与conf字段的时候
        if (argv.name !== '' && argv.conf !== '') {
            cfg['name'] = argv.name;
        }
        //存在dir 不存在conf属性的时候
        if (!!argv.dir && argv.conf === '') {
            //仅支持 linux路径写法
            if (!path.isAbsolute(argv.dir)) {
                argv.dir = path.resolve(process.cwd(), argv.dir);
            } else {
                argv.dir = transformDir(argv.dir);
            }
            cfg['name'] = _.last(argv.dir.split(path.sep));
            cfg['workspace'] = argv.dir.replace(cfg['name'], '').replace(/[\/\\]+$/, '');
        }

        //非配置文件 初始化对应的host
        if (!argv.conf) {
            cfg.devHost = argv.devHost;
            cfg.onLineHost = argv.onLineHost;
            cfg.imgOnLineHost = argv.imgOnLineHost;
        }

        return cfg;
    });
};
