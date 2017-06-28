'use strict';
const os = require('os');
const _ = require('lodash');
const path = require('path');
/**
 * 转换在win控制台下 输入/d/workspace这种linux路径 转化为对应平台的路径
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */
exports.transformDir = function (dir) {
    if (os.platform() !== 'win32') {
        return dir;
    }
    let returnDir = '';
    if (/^\//.test(dir)) {
        let dirList = dir.split('/');
        _.each(dirList, (item, index) => {
            if (index === 0) {
                return;
            }
            if (index === 1) {
                returnDir += (item + ':');
            } else {
                returnDir += ('\\' + item);
            }
        });
        return returnDir;
    } else {
        return dir;
    }
};

/**
 * 让url指定结尾，如果有结尾的话就替换结尾
 * @param  {[type]} url    [description]
 * @param  {[type]} endStr [description]
 * @return {[type]}        [description]
 */
exports.urlEndSuff = function (url,endStr) {
    var reg = new RegExp(endStr + '$');
    if(reg.test(url)){
        return url;
    }else{
        return url + endStr;
    }
};

/**
 * 转化 非正常的url
 * @param  {[type]} url 带转换url
 * @return {[type]}     返回转化后的url
 */
exports.transHostUrl = function (url) {
    if(!/^https{0,1}/.test(url)){
        throw new Error('url must start with http or https');
    }
    let tmpSvnHref = url.split(path.sep).join('/');
    return tmpSvnHref.replace(/^(https{0,1}:\/)([^\/])(.*)/, '$1/$2$3')
};
