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
 * @param  {Object} svnConfig         svn相关信息对象
 * @param  {Object} webpackConfigInfo publicPath信息
 * @param  {String} projectName       项目名称
 * @return {[type]}                   修改后的文本
 */
function filterFileContent(fData, key, svnConfig, webpackConfigInfo, projectName) {
    switch (key) {
        case 'qb.html':
            //没有svnConfig的配置信息的时候不生成qb.html
            if (!svnConfig) {
                return false;
            }
            //svn 的trunk目录下的assets文件目录
            fData = fData.replace('onlineSvnPathStr', svnConfig.onlinePath);
            //svn qb上线到的tag目录
            fData = fData.replace('tagPathStr', svnConfig.tagPath);
            //标签名称  这里应该是文件的名字
            fData = fData.replace('tagNameStr', svnConfig.tagName);
            //标签内新增目录
            fData = fData.replace('addPathStr', svnConfig.addPath);
            break;
        case 'config.js':
            fData = fData.replace('{{publicPath}}', webpackConfigInfo.devPubilcPath);
            fData = fData.replace('{{onlinePath}}', webpackConfigInfo.onLinePubilcPath);
            break;
        case 'package.json':
            fData = fData.replace('{{TODO}}', projectName);
            break;
    }
    return fData;
}
/**
 * 拷贝文件工作
 * @param  {Object} webpackConfigInfo webpack相关动态配置
 * @param  {Object} svnConfig         SVN相关配置
 * @param  {String} rootDir           生成项目的根路径
 * @return {Promise}                  返回promise对象
 */
function copyFile(webpackConfigInfo, svnConfig, rootDir) {
    let projectName = path.basename(rootDir);
    return co(function*() {
        let filesInfo = [];
        //获取filesInfo
        yield* readDirState(path.resolve(__dirname, '..', 'config'), filesInfo);

        for (let fileInfo of filesInfo) {
            //读， 之后写
            let fileContent = yield thunkify(fs.readFile)(fileInfo.local, 'utf-8');
            fileContent = filterFileContent(fileContent, fileInfo.fName, svnConfig, webpackConfigInfo, projectName);
            if (!fileContent) {
                continue;
            }
            let writeFilePath = path.join(rootDir, fileInfo.local.replace(path.resolve(__dirname, '..', 'config'), ''));
            yield thunkify(fs.writeFile)(writeFilePath, fileContent);
        }
    });
}
exports.copyFile = copyFile;
