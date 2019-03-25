"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const _ = require("lodash");
const path = require("path");
/**
 * 判断是否是非法的url
 * @param url
 */
function isIllegalUrl(url) {
    let reg = /^https{0,1}:\/\//;
    if (reg.test(url)) {
        return false;
    }
    else {
        return true;
    }
}
exports.isIllegalUrl = isIllegalUrl;
function isIllegalGit(url) {
    let reg = /^(ssh:\/\/){0,1}git@[\/\w\.\-:\d]*git$/;
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
    let returnDir = '';
    if (/^\//.test(dir)) {
        let dirList = dir.split('/');
        _.each(dirList, (item, index) => {
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
    let reg = new RegExp(endStr + '$');
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
    let tmpSvnHref = url.split(path.sep).join('/');
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
/**
 * 转化普通方法为async的方法。
 * @param fun
 */
function transAsyncPromise(fun) {
    return function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fun.call(null, ...args, (err, arg1) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(arg1);
                    }
                });
            });
        });
    };
}
exports.transAsyncPromise = transAsyncPromise;
