"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var lodash_1 = require("lodash");
var path_1 = require("path");
/**
 * 判断是否是非法的url
 * @param url
 */
function isIllegalUrl(url) {
    var reg = /^http(s):\/\//;
    if (reg.test(url)) {
        return true;
    }
    else {
        return false;
    }
}
exports.isIllegalUrl = isIllegalUrl;
/**
 * 转换在win控制台下 输入/d/workspace这种linux路径 转化为对应平台的路径
 * @param dir
 */
function transformDir(dir) {
    if (os_1.default.platform() !== 'win32') {
        return dir;
    }
    var returnDir = '';
    if (/^\//.test(dir)) {
        var dirList = dir.split('/');
        lodash_1.default.each(dirList, function (item, index) {
            if (index === 0) {
                return;
            }
            if (index === 1) {
                returnDir += (item + ':');
            }
            else {
                returnDir += ('\\' + item);
            }
        });
        return returnDir;
    }
    else {
        return dir;
    }
}
exports.transformDir = transformDir;
/**
 * 让url指定结尾，如果有结尾的话就替换结尾
 * @param  {[type]} url    [description]
 * @param  {[type]} endStr [description]
 * @return {[type]}        [description]
 */
function urlEndSuff(url, endStr) {
    var reg = new RegExp(endStr + '$');
    if (reg.test(url)) {
        return url;
    }
    else {
        return url + endStr;
    }
}
exports.urlEndSuff = urlEndSuff;
/**
 * 转化 非正常的url
 * @param  {[type]} url 带转换url
 * @return {[type]}     返回转化后的url
 */
function transHostUrl(url) {
    if (!/^https{0,1}/.test(url)) {
        throw new Error('url must start with http or https');
    }
    var tmpSvnHref = url.split(path_1.default.sep).join('/');
    return tmpSvnHref.replace(/^(https{0,1}:\/)([^\/])(.*)/, '$1/$2$3');
}
exports.transHostUrl = transHostUrl;
