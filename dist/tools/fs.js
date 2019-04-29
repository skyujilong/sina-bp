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
const fs_1 = require("fs");
const path_1 = require("path");
const readline_1 = require("readline");
const os_1 = require("os");
const bp_conf_1 = require("../module/bp-conf");
const utils_1 = require("./utils");
const tpl_pipe_1 = require("./tpl-pipe");
let asyncReadDir = utils_1.transAsyncPromise(fs_1.readdir);
let asyncLstat = utils_1.transAsyncPromise(fs_1.lstat);
exports.asyncLstat = asyncLstat;
let asyncMkDir = utils_1.transAsyncPromise(fs_1.mkdir);
function readLine(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let readStream = fs_1.createReadStream(dir);
            readStream.setEncoding('utf8');
            let readline = readline_1.createInterface({
                input: readStream
            });
            readStream.on('error', (err) => {
                reject(new Error('配置文件路径错误！'));
            });
            let conf = {
                workspace: '',
                devHost: '',
                prodHost: '',
                prodImgHost: '',
                tinyPngKeys: [],
                qbDir: ''
            };
            readline.on('line', (text) => {
                if (text.indexOf('#') == 0) {
                    return;
                }
                let [key, val] = text.split('=');
                if (key == 'tinyPngKeys' && val.indexOf(',') != -1) {
                    for (let item of val.split(',')) {
                        conf.tinyPngKeys.push(item);
                    }
                }
                else {
                    conf[key] = val;
                }
            });
            readline.on('close', () => {
                let { workspace, devHost, prodHost, prodImgHost, tinyPngKeys, qbDir } = conf;
                if (!workspace || !devHost || !prodHost) {
                    reject(new Error('配置文件至少需要如下参数：workspace,devHost,prodHost'));
                }
                let bpConf = new bp_conf_1.default(workspace, devHost, prodHost, prodImgHost, tinyPngKeys, qbDir);
                resolve(bpConf);
            });
        });
    });
}
exports.readLine = readLine;
function vailDir(location) {
    return __awaiter(this, void 0, void 0, function* () {
        let isThrowError = false;
        try {
            let stats = yield asyncLstat(location);
            if (stats.isDirectory()) {
                isThrowError = true;
            }
        }
        catch (e) {
        }
        if (isThrowError) {
            throw new Error(`${location}该路径已经存在了！请更换地址。`);
        }
    });
}
exports.vailDir = vailDir;
/**
 * 处理根目录
 * @param location
 */
function mkRootDir(location) {
    return __awaiter(this, void 0, void 0, function* () {
        let list = location.split(path_1.sep);
        let currentDir;
        for (let i = 0; i < list.length; i++) {
            if (i === 0) {
                currentDir = list[i];
                if (os_1.platform() !== 'win32') {
                    currentDir = '/' + currentDir;
                }
                continue;
            }
            currentDir = path_1.join(currentDir, list[i]);
            try {
                // await asyncMkDir(currentDir);
                yield utils_1.transAsyncPromise(fs_1.mkdir)(currentDir);
            }
            catch (error) {
                continue;
            }
        }
    });
}
exports.mkRootDir = mkRootDir;
/**
 *
 * @param copyFrom 从哪里进行拷贝
 * @param copyTarget 写入到哪里去
 * @param buildInfo 构建信息
 */
function copy(copyFrom, copyTarget, buildInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let readStream = fs_1.createReadStream(copyFrom);
            readStream.setEncoding('utf8');
            let writeStream = fs_1.createWriteStream(copyTarget);
            writeStream.setDefaultEncoding('utf8');
            let transTpl = new tpl_pipe_1.default({
                data: buildInfo
            });
            transTpl.setEncoding('utf8');
            writeStream.on('finish', () => {
                resolve();
            });
            readStream.on('error', (err) => {
                reject(err);
            });
            writeStream.on('error', (err) => {
                reject(err);
            });
            readStream.pipe(transTpl).pipe(writeStream);
        });
    });
}
/**
 * 拷贝文件以及文件夹
 * @param targetDir 目标要拷贝到的文件夹
 * @param relativePath 相对路径
 */
function asyncCopyFile(targetDir, relativePath, buildInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        //配置文件根目录
        let confDir = path_1.resolve(__dirname, '..', '..', 'config');
        //配置文件+ 相对路径，下的所有文件
        let dirStats = yield asyncReadDir(path_1.join(confDir, relativePath));
        for (let name of dirStats) {
            let stats = yield asyncLstat(path_1.join(confDir, relativePath, name));
            if (stats.isDirectory()) {
                yield asyncMkDir(path_1.join(targetDir, relativePath, name));
                yield asyncCopyFile(targetDir, path_1.join(relativePath, name), buildInfo);
            }
            else if (stats.isFile()) {
                yield copy(path_1.join(confDir, relativePath, name), path_1.join(targetDir, relativePath, name), buildInfo);
            }
        }
    });
}
exports.asyncCopyFile = asyncCopyFile;
function writeFilePro(fileDir, content) {
    return new Promise((resolve, reject) => {
        fs_1.writeFile(fileDir, content, {
            encoding: 'utf-8'
        }, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
/**
 * 写文件操作
 * @param targetDir 写如的文件夹
 * @param fileName 文件名称
 * @param fileContent 文件内容
 */
function asyncWriteFile(targetDir, fileName, fileContent) {
    return __awaiter(this, void 0, void 0, function* () {
        let fileDir = path_1.join(targetDir, fileName);
        yield writeFilePro(fileDir, fileContent);
    });
}
exports.asyncWriteFile = asyncWriteFile;
