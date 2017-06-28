'use strict';
const fs = require('fs');
const dirConfig = require('./dir.config.js');
const _ = require('lodash');
const path = require('path');
const co = require('co');
const os = require('os');
const thunkify = require('thunkify');

/**
 * 构建project内目录
 * @param  {[type]} currentDir [description]
 * @return {[type]}            [description]
 */
function buildProjectDir(currentDir) {
    // [[fn,fn,fn],[fn,fn,fn]]
    let taskList = [];
    /**
     * 初始化taskList task是数组中嵌套数组的结构，
     * 出栈顺序为先后的顺序。
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
    //通过task函数，扁平化数据结构。
    //通过递归方案配合生成器与co目前还没有想好怎么做
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
                //windows d:  linux sss 缺少/
                if(os.platform() !== 'win32'){
                    currentDir = '/' + currentDir;
                }

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

/**
 * 验证根目录是否已经存在了，如果存在，则报错
 * @param  {[type]} rootDir [description]
 * @return {[type]}         [description]
 */
function validateRoot(rootDir){
    return co(function *(){
        try{
            let stats  = yield thunkify(fs.stat)(rootDir);
            if(stats.isDirectory()){
                throw new Error('the dir : "' + rootDir + '" is exist!');
            }
        }catch(e){
            //什么也不用做
        }
    });
}


module.exports = {

    initRoot: initRoot,

    buildProjectDir: buildProjectDir,

    validateRoot: validateRoot

}
