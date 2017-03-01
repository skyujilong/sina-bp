/**
 * Created by sina on 2016/6/27.
 */
"use strict";
const fs = require('fs');
const path = require('path');
const dirConfig = require('./lib/dir.config.js');
const fileConfg = require('./lib/file.config.js');
const svnInit = require('./lib/svn_init');
let _ = require('lodash');
const svnConfig = require('./lib/svn_config');
let argv = require('optimist').default({
    'dir': process.cwd(),
    'svn': '',
    'pubilcPath': 'http://test.sina.com.cn/',
    'testPublicPath': 'http://test.sina.com.cn/'
}).argv;

//TODO  如果没有svn 地址就不去初始化svn相关内容
//TODO publicPath 默认与testPublicPath是一样的

const dirHandler = require('./lib/initDir');

const fileHandler = require('./lib/copyFile.js');

//上线svn路径
const onlinePath = svnConfig.svnBaseUrl + svnConfig.iteamName + '/assets/';
// 标签svn路径
const tagPath = svnConfig.tagUrl;
//标签名称
const tagName = 'items_' + svnConfig.year + '_' + svnConfig.iteamName + '_release';
// 新增目录
const addDir = 'news/items/' + svnConfig.year + '/' + svnConfig.iteamName + '/';
// const basePath = path.join(argv.homeDir, svnConfig.iteamName);



//添加基础文件
function addFile() {
    let dir = path.resolve(__dirname, './config');
    _.forEach(fileConfg, function(val, key) {
        fs.readFile(path.join(dir, key), 'utf-8', (err, data) => {
            if (err) {
                throw err;
            }
            if (key === 'qb.html') {
                typeof data;


                data = data.replace('onlineSvnPathStr', onlinePath);
                data = data.replace('tagPathStr', tagPath)
                data = data.replace('tagNameStr', tagName)
                data = data.replace('addPathStr', addDir)

            }
            fs.writeFile(path.resolve(basePath, val, key), data, (err) => {
                if (err) {
                    throw err;
                }
            });
        });
    });
}


// svnInit.init(function(){
//
//        //建立基本文件夹
//     //    dirBuild(basePath,function(){
//     //        addFile();
//     //    });
// });

// dirHandler('../demo/test');

if (argv.svn) {
    //TODO 初始化svn对应的目录
} else {
    //TODO 仅仅初始化本地文件夹
    dirHandler(argv.dir, function(absPath) {
        fileHandler.copy(argv.testPublicPath, argv.pubilcPath, '', absPath, function() {
            console.log('done...........');
        });
    });
}
