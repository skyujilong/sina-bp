'use strict';
const fs = require('fs');
const dirConfig = require('./dir.config.js');
const _ = require('lodash');
const path = require('path');
const co = require('co');
const thunkify = require('thunkify');
const util = require('util');


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
    let list = pathDir.split(path.sep);

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
/**
 * 文件夹状态thunk function化
 * @param  {[type]} dir 地址
 * @return {[type]}     [description]
 */
function _lstat(dir) {
    return function(fn) {
        fs.lstat(dir, function(err) {
            fn(err);
        });
    }
}
/**
 * 构建project内目录
 * @param  {[type]} currentDir [description]
 * @return {[type]}            [description]
 */
function buildProjectDir(currentDir) {
    // [[fn,fn,fn],[fn,fn,fn]]
    let taskList = [];
    /**
     * 初始化taskList task是数组中嵌套数组的结构，出栈顺序为先后的顺序。
     * @param  {String} dir    产生创建dir的路径
     * @param  {Object} subDir 文件夹的信息
     * @param  {Number} index  权重 越小权重越大
     */
    function initTaskList(dir, subDir, index) {
        if (subDir.length === 0) {
            return;
        }
        _.each(subDir, function(val) {
            let nextPath = path.join(dir, val.dirName);
            if (!taskList[index]) {
                taskList[index] = [];
            }
            taskList[index].push(thunkify(fs.mkdir)(nextPath));
            initTaskList(nextPath, val.subDir, index + 1);
        });
    }
    //通过task函数，扁平化数据结构。递归方案配合生成器与co目前还没有想好怎么做
    initTaskList(currentDir, dirConfig.subDir, 0);
    return co(function*() {
        for (let i = 0; i < taskList.length; i++) {
            yield taskList[i];
        }
    });
}

/**
 * 生成main dir路径的方法
 * @param  {String} rootDir 路径
 * @return {Promise}          Promise对象
 */
function initRoot(rootDir) {
    return co(function*(pathDir) {

        let fsState = thunkify(fs.lstat);
        let fsMkDir = thunkify(fs.mkdir);
        let list = pathDir.split(path.sep);
        let currentDir;

        for (let i = 0; i < list.length; i++) {
            let ret;
            if (i === 0) {
                currentDir = list[i];
                continue;
            } else {
                currentDir = path.join(currentDir, list[i]);
            }
            try {
                ret = yield fsState(currentDir);
            } catch (e) {
                //创建文件件
                ret = yield fsMkDir(currentDir);
            }
        }
    }, rootDir);
}
let testPath = path.resolve(process.cwd(), path.join('../../../playground/test01/test02'));
initRoot(testPath).then(function() {
    return buildProjectDir(testPath);
}, function(e) {
    console.log('e 01');
    console.log(e.stack);
}).then(function() {
    console.log('done...........');
}, function(e) {
    console.log('e 02');
    console.log(e.stack);
})



module.exports = {
    initRootDir: function(pathDir, cb) {
        let cwd = process.cwd(),
            absPath;
        if (path.isAbsolute(pathDir)) {
            absPath = pathDir;
        } else {
            absPath = path.resolve(cwd, pathDir);
        }
        // buildRootDir(absPath, function() {
        //     bulid(absPath, dirConfig.subDir);
        //     cb(absPath);
        // });
        initRoot(absPath, function() {

        }, function() {});
    },

    synBuildSubDir: function(absPath) {
        bulid(absPath, dirConfig.subDir);
    }

}
