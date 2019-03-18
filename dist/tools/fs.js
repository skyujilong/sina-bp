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
var fs_1 = require("fs");
var path_1 = require("path");
var readline_1 = require("readline");
var os_1 = require("os");
var bp_conf_1 = require("../module/bp-conf");
var utils_1 = require("./utils");
var asyncReadDir = utils_1.transAsyncPromise(fs_1.readdir);
var asyncLstat = utils_1.transAsyncPromise(fs_1.lstat);
exports.asyncLstat = asyncLstat;
var asyncMkDir = utils_1.transAsyncPromise(fs_1.mkdir);
function readLine(dir) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var readStream = fs_1.createReadStream(dir);
                    var readline = readline_1.createInterface({
                        input: readStream
                    });
                    readStream.on('error', function (err) {
                        reject(new Error('配置文件路径错误！'));
                    });
                    var conf = {
                        workspace: '',
                        devHost: '',
                        prodHost: '',
                        prodImgHost: '',
                        tinyPngKeys: []
                    };
                    readline.on('line', function (text) {
                        if (text.indexOf('#') == 0) {
                            return;
                        }
                        var _a = text.split('='), key = _a[0], val = _a[1];
                        if (key == 'tinyPngKeys' && val.indexOf(',') != -1) {
                            for (var _i = 0, _b = val.split(','); _i < _b.length; _i++) {
                                var item = _b[_i];
                                conf.tinyPngKeys.push(item);
                            }
                        }
                        else {
                            conf[key] = val;
                        }
                    });
                    readline.on('close', function () {
                        var workspace = conf.workspace, devHost = conf.devHost, prodHost = conf.prodHost, prodImgHost = conf.prodImgHost, tinyPngKeys = conf.tinyPngKeys;
                        if (!workspace || !devHost || !prodHost) {
                            reject(new Error('配置文件至少需要如下参数：workspace,devHost,prodHost'));
                        }
                        var bpConf = new bp_conf_1.default(workspace, devHost, prodHost, prodImgHost, tinyPngKeys);
                        resolve(bpConf);
                    });
                })];
        });
    });
}
exports.readLine = readLine;
function vailDir(location) {
    return __awaiter(this, void 0, void 0, function () {
        var isThrowError, stats, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isThrowError = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, asyncLstat(location)];
                case 2:
                    stats = _a.sent();
                    if (stats.isDirectory()) {
                        isThrowError = true;
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    if (isThrowError) {
                        throw new Error(location + "\u8BE5\u8DEF\u5F84\u5DF2\u7ECF\u5B58\u5728\u4E86\uFF01\u8BF7\u66F4\u6362\u5730\u5740\u3002");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.vailDir = vailDir;
/**
 * 建立文件夹
 * @param location
 */
// async function asyncMkDir(location:string):Promise<void>{
//     return new Promise((resolve,reject)=>{
//         mkdir(location,(err)=>{
//             if(err){
//                 reject(err);
//             }else{
//                 resolve();
//             }
//         })
//     });
// }
/**
 * 处理根目录
 * @param location
 */
function mkRootDir(location) {
    return __awaiter(this, void 0, void 0, function () {
        var list, currentDir, i, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    list = location.split(path_1.sep);
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < list.length)) return [3 /*break*/, 6];
                    if (i === 0) {
                        currentDir = list[i];
                        if (os_1.platform() !== 'win32') {
                            currentDir = '/' + currentDir;
                        }
                        return [3 /*break*/, 5];
                    }
                    currentDir = path_1.join(currentDir, list[i]);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    // await asyncMkDir(currentDir);
                    return [4 /*yield*/, utils_1.transAsyncPromise(fs_1.mkdir)(currentDir)];
                case 3:
                    // await asyncMkDir(currentDir);
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    return [3 /*break*/, 5];
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.mkRootDir = mkRootDir;
function copy(copyFrom, copyTarget) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var readStream = fs_1.createReadStream(copyFrom);
                    var writeStream = fs_1.createWriteStream(copyTarget);
                    writeStream.on('finish', function () {
                        resolve();
                    });
                    readStream.on('error', function (err) {
                        reject(err);
                    });
                    writeStream.on('error', function (err) {
                        reject(err);
                    });
                    readStream.pipe(writeStream);
                })];
        });
    });
}
function asyncCopyFile(targetDir, relativePath) {
    return __awaiter(this, void 0, void 0, function () {
        var confDir, dirStats, _i, dirStats_1, name_1, stats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    confDir = path_1.resolve(__dirname, '..', '..', 'config');
                    return [4 /*yield*/, asyncReadDir(path_1.join(confDir, relativePath))];
                case 1:
                    dirStats = _a.sent();
                    _i = 0, dirStats_1 = dirStats;
                    _a.label = 2;
                case 2:
                    if (!(_i < dirStats_1.length)) return [3 /*break*/, 9];
                    name_1 = dirStats_1[_i];
                    return [4 /*yield*/, asyncLstat(path_1.join(confDir, name_1))];
                case 3:
                    stats = _a.sent();
                    if (!stats.isDirectory()) return [3 /*break*/, 6];
                    return [4 /*yield*/, asyncMkDir(path_1.join(targetDir, name_1))];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, asyncCopyFile(path_1.join(targetDir, name_1), name_1)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 6:
                    if (!stats.isFile()) return [3 /*break*/, 8];
                    // await 
                    return [4 /*yield*/, copy(path_1.join(confDir, name_1), path_1.join(targetDir, name_1))];
                case 7:
                    // await 
                    _a.sent();
                    _a.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 2];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.asyncCopyFile = asyncCopyFile;
