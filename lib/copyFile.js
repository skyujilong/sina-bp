'use strict';

const fs = require('fs');
const path = require('path');
const fileConfig = require('./file.config.js');
const _ = require('lodash');

/**
 * 写数据操作
 * @param  {String}   fd   路径
 * @param  {String}   data 数据内容
 * @param  {Function} cb   [description]
 * @return {[type]}        [description]
 */
function writeFile(fd, data, cb) {
    fs.writeFile(fd, data, function(err) {
        if (err) {
            throw err;
        }
        cb();
    });
}


module.exports = {
    /**
     * 复制文件
     * @param  {Object} webpackConfigInfo webpack相关动态配置
     * @param  {Object} svnConfig         SVN相关配置
     * @param  {String} rootDir           生成项目的根路径
     * @param  {Function} cb              文件复制完毕的回调函数
     */
    copy: function(webpackConfigInfo, svnConfig, rootDir, cb) {
        let count = _.size(fileConfig);
        _.each(fileConfig, function(val, key) {

            fs.readFile(path.resolve(__dirname, '..', 'config', key), 'utf-8', function(err, fData) {
                if (err) {
                    throw err;
                }
                switch (key) {
                    case 'qb.html':
                        //没有svnConfig的配置信息的时候不生成qb.html
                        if(!svnConfig){
                            count--;
                            return;
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
                        fData = fData.replace('{{publicPath}}',webpackConfigInfo.devPubilcPath);
                        fData = fData.replace('{{onlinePath}}',webpackConfigInfo.onLinePubilcPath);
                        break;
                }
                writeFile(path.resolve(rootDir, val, key), fData, function() {
                    count--;
                    if(count === 0){
                        cb();
                    }
                });
            });
        });
    }
}
