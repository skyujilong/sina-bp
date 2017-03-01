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
     * @param  {[type]} testPublicPath 测试服务地址
     * @param  {[type]} publicPath     上线服务地址
     * @param  {[type]} svnPath        SVN地址
     * @param  {[type]} rootDir        生成项目的根路径
     * @param  {[type]} cb             文件复制完毕的回调函数
     */
    copy: function(testPublicPath, publicPath, svnPath, rootDir, cb) {
        let count = _.size(fileConfig);
        _.each(fileConfig, function(val, key) {

            fs.readFile(path.resolve(__dirname, '..', 'config', key), 'utf-8', function(err, fData) {
                if (err) {
                    throw err;
                }
                switch (key) {
                    case 'qb.html':
                        fData = fData.replace('onlineSvnPathStr', '');
                        fData = fData.replace('tagPathStr', '');
                        fData = fData.replace('tagNameStr', '');
                        fData = fData.replace('addPathStr', '');
                        break;
                    // case 'webpack.config.js':
                    //
                    //     break;
                }

                console.log(path.resolve(rootDir, val, key));
                writeFile(path.resolve(rootDir, val, key), fData , function() {
                    count--;
                    console.log('{key} is write done');
                });
            });
        });
    }
}
