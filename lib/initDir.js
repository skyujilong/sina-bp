'use strict';
const fs = require('fs');
const dirConfig = require('./dir.config.js');
const _ = require('lodash');
const path = require('path');

function bulid(currentDir, list) {
    _.forEach(list, function(value) {
        fs.mkdirSync(path.join(currentDir, value.dirName));
        bulid(path.join(currentDir, value.dirName), value.subDir);
    });
}
/**
 * 构建项目根路径文件夹
 * @param  {[type]} pathDir [description]
 * @param  {[type]} doneCb  [description]
 * @return {[type]}         [description]
 */
function buildRootDir(pathDir, doneCb) {
    var list = pathDir.split(path.sep);

    function build(dir, index) {
        if (index === list.length - 1) {
            doneCb();
            return;
        }
        dir = path.join(dir, list[index + 1]);
        fs.lstat(dir, function(err) {
            if (err) {
                fs.mkdir(dir, function(err) {
                    if (err) {
                        throw err;
                    }
                    build(dir, index + 1);
                });
            } else {
                build(dir, index + 1);
            }
        });
    }
    build(list[0], 0);
}

module.exports = function(pathDir, cb) {
    var cwd = process.cwd(),
        absPath;
    if (path.isAbsolute(pathDir)) {
        absPath = pathDir;
    } else {
        absPath = path.resolve(cwd, pathDir);
    }
    console.log(absPath);
    buildRootDir(absPath, function() {
        bulid(absPath, dirConfig.subDir);
        cb(absPath);
    });
}
