'use strict';
const co = require('co');
const thunkfiy = require('thunkify');
const fs = require('fs');
const path = require('path');
const os = require('os');
const _ = require('lodash');
const transformDir = require('./util').transformDir;
const urlEndSuff = require('./util').urlEndSuff;
const transHostUrl = require('./util').transHostUrl;
const Constant = require('./constant');

//const defaultHost = 'http://test.sina.com.cn/';

const _cfg = {
    'name': '', //项目名称
    'workspace': '', //项目目录
    'svn': '', //svn地址
    'devHost': '', // 开发环境资源路径
    'onLineHost': '', //线上资源路径
    'onLineImgHost': '', //线上图片资源路径
    'qbNewDir': '', //qb相关新增路径，该字段选填，要是没有，不生成qb.html文件
    'tinyPngKeys': ['346gfotHJspgPYXmOuSAWhSl4CxlUox7']//tinypngkeys
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
    let lineReg = /\s*([^\n\r]+)(\n|\r){0,1}/g;
    let arrayReg = /^\[(.*)\]$/;
    let result;
    while (result = lineReg.exec(cfgContent)) {
        //解析属性 ，init cfgObj
        let _r = result[1].match(/([^:]+):(.*)/);
        if (_r && Object.prototype.toString.call(cfgObj[_.trim(_r[1], '\'"')]) !== '[object Undefined]') {
            let val = _.trim(_r[2], '\'"');
            let key = _.trim(_r[1], '\'"');
            if (arrayReg.test(val)){
                // 转化为对应的数组类型
                cfgObj[key] = val;
            } else if (key === 'tinyPngKeys') {
                // 特殊内容需要特殊对待一下
                cfgObj[key] ='"' + val + '"';
            } else {
                cfgObj[key] = val;
            }
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
    //清理属性后面的注释文案
    // cfgContent = cfgContent.replace(/(['"][^'"]*['"]).*/g, '$1');
    cfgContent = cfgContent.replace(/:\s*((['"][^'"]*['"]).*|(\[[^\]]*\]).*)/g,function($0,$1,$2,$3){
        if(!$2){
            return ':' + $3;
        }else{
            return ':' + $2;
        }
    });
    //清除中间的 /* asdfl;ajfsdkla */ 这种注释
    cfgContent = cfgContent.replace(/\/\*[\s\S]*\*\//g, '');
    //清理 前后的空白
    cfgContent = _.trim(cfgContent);
    return cfgContent;
}

/**
 * 初始化svn相关信息
 * @param  {[type]} cfg [description]
 * @return {[type]}     [description]
 */
function initQBInfo(cfg) {
    if (cfg.svn === '') {
        return;
    }
    if (cfg.qbNewDir && cfg.qbNewDir.indexOf('/') === 0) {
        throw new Error('qbNewDir must not begin with /');
    }

    let svnYear;

    try {
        svnYear = cfg.svn.match(/\/(\d+)\/{0,1}$/)[1];
    } catch (e) {
        throw new Error('svn path need year end!');
    }
    cfg.svn = urlEndSuff(cfg.svn, '/');
    cfg.qbInfo = {
        //svn 地址
        svnUrl: cfg.svn + cfg.name,
        //svn tag 地址
        svnTagUrl: cfg.svn.replace('trunk', 'tags') + cfg.name + '/',
        qbAddPath: cfg.qbNewDir !== ''
            ? urlEndSuff(cfg.qbNewDir, '/') + svnYear + '/' + cfg.name + '/'
            : '',
        tagName: cfg.name
    };

    if (cfg.qbInfo.qbAddPath) {
        cfg.onLineHost += cfg.qbInfo.qbAddPath;
        cfg.onLineImgHost += cfg.qbInfo.qbAddPath;
    }
}

/**
 * 初始化 配置文件信息
 * @return {Object} 返回配置文件
 */
module.exports = function(argv) {
    return co(function * () {
        let cfg = Object.assign(_cfg);
        if (Object.prototype.toString.call(argv.conf) === '[object String]' && argv.conf !== '') {
            // yield
            let _cfg = yield readCfgFile(argv.conf);
            cfg = Object.assign(cfg, _cfg);
            //没有初始化 采用备用的
            if (argv.devHost !== Constant.defaultHost) {
                cfg.devHost = urlEndSuff(transHostUrl(argv.devHost), '/');
            } else {
                cfg.devHost = urlEndSuff(cfg.devHost || argv.devHost, '/');
            }

            if (argv.onLineHost !== Constant.defaultHost) {
                cfg.onLineHost = urlEndSuff(transHostUrl(argv.onLineHost), '/');
            } else {
                cfg.onLineHost = urlEndSuff(cfg.onLineHost || argv.onLineHost, '/');
            }

            //onLineImgHost 有为空的可能性，如果为空，则取onLineHost的值
            if (argv.onLineImgHost !== Constant.defaultHost) {
                cfg.onLineImgHost = urlEndSuff(transHostUrl(argv.onLineImgHost || cfg.onLineHost), '/');
            } else {
                cfg.onLineImgHost = urlEndSuff(cfg.onLineImgHost || cfg.onLineHost, '/');
            }
        }
        //同时存在 name与conf字段的时候
        if (Object.prototype.toString.call(argv.name) === '[object String]' && Object.prototype.toString.call(argv.conf) === '[object String]' && argv.name !== '' && argv.conf !== '') {
            cfg['name'] = argv.name;
        }

        //存在dir 不存在conf属性的时候
        if (!!argv.dir && (Object.prototype.toString.call(argv.conf) !== '[object String]' || Object.prototype.toString.call(argv.conf) === '[object String]' && argv.conf !== '')) {
            //仅支持 linux路径写法
            if (!path.isAbsolute(argv.dir)) {
                argv.dir = path.resolve(process.cwd(), argv.dir);
            } else {
                argv.dir = transformDir(argv.dir);
            }
            cfg['name'] = _.last(argv.dir.split(path.sep));
            cfg['workspace'] = argv.dir.replace(new RegExp(cfg['name'] + '$'), '').replace(/[\/\\]+$/, '');
        }

        //非配置文件 初始化对应的host
        if (!argv.conf) {
            cfg.devHost = urlEndSuff(transHostUrl(argv.devHost), '/');
            cfg.onLineHost = urlEndSuff(transHostUrl(argv.onLineHost), '/');
            cfg.onLineImgHost = urlEndSuff(transHostUrl(argv.onLineImgHost || argv.onLineHost), '/');
        }

        initQBInfo(cfg);

        if (!cfg.name) {
            throw new Error('need a project name!');
        }

        return cfg;
    });
};
