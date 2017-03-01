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
//TODO 删除svn_config文件
svnConfig = require('./lib/svn_config');
let argv = require('optimist').default({
    'dir': process.cwd(),
    'svn': '',
    'devPubilcPath': 'http://test.sina.com.cn/',
    'onLinePublicPath': 'http://test.sina.com.cn/'
}).argv;

//如果没有svn 地址就不去初始化svn相关内容
//publicPath 默认与testPublicPath是一样的

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
    //https://svn1.intra.sina.com.cn/sinanews/trunk/ria/items/2017 trunk代码位置
    //https://svn1.intra.sina.com.cn/sinanews/tags/ria/items/2017  tag代码位置
    
} else {
    //仅仅初始化本地文件夹
    dirHandler(argv.dir, function(absPath) {
        //absPath 是项目生成的根目录路径
        fileHandler.copy({
            devPubilcPath: argv.devPubilcPath,
            onLinePubilcPath: argv.onLinePublicPath
        }, null, absPath, function() {
            console.log('file write done!');
        });
    });
}
