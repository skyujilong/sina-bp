"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
/**
 * 转化普通方法为async的方法。
 * @param fun
 */
function transAsyncPromise(fun) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fun.call.apply(fun, [null].concat(args, [function (err, arg1) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(arg1);
                                }
                            }]));
                    })];
            });
        });
    };
}
exports.transAsyncPromise = transAsyncPromise;
