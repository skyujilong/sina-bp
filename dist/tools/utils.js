"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var _ = require("lodash");
var path = require("path");
/**
 * 判断是否是非法的url
 * @param url
 */
function isIllegalUrl(url) {
    var reg = /^https{0,1}:\/\//;
    if (reg.test(url)) {
        return false;
    }
    else {
        return true;
    }
}
exports.isIllegalUrl = isIllegalUrl;
function isIllegalGit(url) {
    var reg = /^(ssh:\/\/){0,1}git@[\/\w\.\-:\d]*git$/;
    return !reg.test(url);
}
exports.isIllegalGit = isIllegalGit;
/**
 * 转换在win控制台下 输入/d/workspace这种linux路径 转化为对应平台的路径
 * @param dir
 */
function transformDir(dir) {
    if (os.platform() !== 'win32') {
        return dir;
    }
    var returnDir = '';
    if (/^\//.test(dir)) {
        var dirList = dir.split('/');
        _.each(dirList, function (item, index) {
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
    var tmpSvnHref = url.split(path.sep).join('/');
    return tmpSvnHref.replace(/^(https{0,1}:\/)([^\/])(.*)/, '$1/$2$3');
}
exports.transHostUrl = transHostUrl;
/**
 * 获取git地址的项目名字
 * @param url
 */
function getGitName(url) {
    return /\/([\w-]*)\.git$/.exec(url)[1];
}
exports.getGitName = getGitName;
