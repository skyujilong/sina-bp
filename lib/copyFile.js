'use strict';

const fs = require('fs');
const path = require('path');
const co = require('co');
const thunkify = require('thunkify');

/**
 * 扫描指定dir，获取dir下的所有文件与文件夹信息
 * @param  {[type]}    dir    [description]
 * @param  {[type]}    config [description]
 * @return {Generator}        [description]
 */
function* readDirState(dir, config) {
    const readdir = thunkify(fs.readdir);
    const lstat = thunkify(fs.lstat);
    let names = yield readdir(dir);
    for (let name of names) {
        let filePath = path.join(dir, name);
        let fstat = yield lstat(filePath)
        if (fstat.isFile()) {
            config.push({
                fName: name,
                local: filePath
            });
        } else if (fstat.isDirectory()) {
            yield* readDirState(filePath, config);
        }
    }
}

/**
 * 过滤文件内容
 * @param  {String} fData             文本内容
 * @param  {String} key               文件名
 * @param  {Object} options           选项信息
 * @return {[type]}                   修改后的文本
 */
function filterFileContent(fData, key, options) {
    switch (key) {
        case 'qb.html':
            //没有svnConfig的配置信息的时候不生成qb.html
            if (!options.qbInfo || (options.qbInfo && !options.qbInfo.qbAddPath)) {
                return false;
            }
            //svn 的trunk目录下的assets文件目录
            fData = fData.replace('onlineSvnPathStr', options.qbInfo.svnUrl + '/assets/');
            //svn qb上线到的tag目录
            fData = fData.replace('tagPathStr', options.qbInfo.svnTagUrl);
            //标签名称  这里应该是文件的名字
            fData = fData.replace('tagNameStr', options.qbInfo.tagName);
            //标签内新增目录
            fData = fData.replace('addPathStr', options.qbInfo.qbAddPath);
            break;
        case 'config.js':
            fData = fData.replace('{{publicPath}}', options.devHost);
            fData = fData.replace('{{onlinePath}}', options.onLineHost);
            fData = fData.replace('{{onlineImgPath}}', options.onLineImgHost);
            fData = fData.replace('{{tinyPngKeys}}', options.tinyPngKeys);
            break;
        case 'package.json':
            fData = fData.replace('{{TODO}}', options.name);
            break;
    }
    return fData;
}
/**
 * 拷贝文件工作
 * @param  {Object} options           配置相关信息
 * @param  {String} rootDir           生成项目的根路径
 * @return {Promise}                  返回promise对象
 */
function copyFile(options, rootDir) {
    let projectName = options.name;
    return co(function*() {
        let filesInfo = [];
        //获取filesInfo
        yield* readDirState(path.resolve(__dirname, '..', 'config'), filesInfo);

        for (let fileInfo of filesInfo) {
            //读， 之后写
            let fileContent = yield thunkify(fs.readFile)(fileInfo.local, 'utf-8');
            fileContent = filterFileContent(fileContent, fileInfo.fName, options);
            if (!fileContent) {
                continue;
            }
            let writeFilePath = path.join(rootDir, fileInfo.local.replace(path.resolve(__dirname, '..', 'config'), ''));
            yield thunkify(fs.writeFile)(writeFilePath, fileContent);
        }
    });
}
exports.copyFile = copyFile;
