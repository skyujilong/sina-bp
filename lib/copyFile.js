'use strict';

const fs = require('fs');
const path = require('path');
const fileConfig = require('./file.config.js');
const _ = require('lodash');
const co = require('co');
const thunkify = require('thunkify');

/**
 * 过滤文件内容
 * @param  {[type]} fData             [description]
 * @param  {[type]} key               [description]
 * @param  {[type]} svnConfig         [description]
 * @param  {[type]} webpackConfigInfo [description]
 * @return {[type]}                   [description]
 */
function filterFileContent(fData, key, svnConfig, webpackConfigInfo) {
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
    return co(function*() {
        for (let key in fileConfig) {
            let filePath = path.join(__dirname, '..', 'config', key);
            let fileContent = yield thunkify(fs.readFile)(filePath, 'utf-8');
            fileContent = filterFileContent(fileContent, key, svnConfig, webpackConfigInfo);
            if(!fileContent){
                continue;
            }
            yield thunkify(fs.writeFile)(path.resolve(rootDir, fileConfig[key], key), fileContent);
        }
    });
}

exports.copyFile = copyFile;
