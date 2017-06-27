'use strict';
const os = require('os');
const _ = require('lodash');
/**
 * 转换在win控制台下 输入/d/workspace这种linux路径 转化为对应平台的路径
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */
exports.transformDir = function (dir) {
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
            } else {
                returnDir += ('\\' + item);
            }
        });
        return returnDir;
    } else {
        return dir;
    }
};
