/**
 * Created by sina on 2016/6/27.
 */
"use strict";
const path = require('path');
const dirConfig = require('./lib/dir.config.js');
const fileConfg = require('./lib/file.config.js');
const svnHandler = require('./lib/svnInit');
const _ = require('lodash');

const dirHandler = require('./lib/initDir');

const fileHandler = require('./lib/copyFile.js');

//TODO 删除svn_config文件
// svnConfig = require('./lib/svn_config');
let argv = require('optimist').default({
    'dir': process.cwd(),
    'svn': '',
    'devPubilcPath': 'http://test.sina.com.cn/',
    'onLinePublicPath': 'http://test.sina.com.cn/'
}).argv;

const projectName = _.last(argv.dir.split(path.sep));

//为了防止 用户的system time 错误，因此采用用户自己输入时间
let svnYear;

if (argv.svn) {
    let tmpSvnHref = argv.svn.split(path.sep).join('/');
    //主要是处理 有些内容 返回的结构是 https:\xxx\asdfas\asdfa\ 这种
    argv.svn = tmpSvnHref.replace(/^(https:\/)([^\/])(.*)/,'$1/$2$3');
    try {
        svnYear = argv.svn.match(/\/(\d+)\/{0,1}$/)[1];
    } catch (e) {
        throw new Error('svn path need year end!');
    }

}
//默认格式化 svn地址不已/结尾
//argv.svn = argv.svn.replace(/\/$/, '');

let svnConfig = argv.svn ? {
    //svn trunk 地址
    svn: argv.svn + '/' + projectName,
    //svn qb 输入发布代码路径
    onlinePath: argv.svn + '/' + projectName + '/assets/',
    //svn qb 输入标签路径
    tagPath: argv.svn.replace('trunk', 'tags') + '/' + projectName,
    //标签名字
    tagName: projectName,
    //标签内新增目录
    addPath: 'news/items/' + svnYear + '/' + projectName + '/'
} : null;


if (argv.svn) {
    //TODO 初始化svn对应的目录
    //https://svn1.intra.sina.com.cn/sinanews/trunk/ria/items/2017 trunk代码位置
    //https://svn1.intra.sina.com.cn/sinanews/tags/ria/items/2017  tag代码位置
    svnHandler.init(argv.dir, svnConfig, function(projectPath) {
        dirHandler.synBuildSubDir(projectPath);
        fileHandler.copy({
            devPubilcPath: argv.devPubilcPath,
            onLinePubilcPath: argv.onLinePublicPath
        }, svnConfig, projectPath, function() {
            console.log('file write done!');
        });
    });


} else {
    //仅仅初始化本地文件夹
    dirHandler.initRootDir(argv.dir, function(projectPath) {
        //absPath 是项目生成的根目录路径
        fileHandler.copy({
            devPubilcPath: argv.devPubilcPath,
            onLinePubilcPath: argv.onLinePublicPath
        }, svnConfig, projectPath, function() {
            console.log('file write done!');
        });
    });
}
