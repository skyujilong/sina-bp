/**
 * Created by sina on 2016/6/27.
 */
"use strict";
const path = require('path');
const svnHandler = require('./lib/svnInit');
const _ = require('lodash');
const dirHandler = require('./lib/initDir');
const fileHandler = require('./lib/copyFile.js');
const util = require('util');
const chalk = require('chalk');

let argv = require('optimist').default({
    'dir': process.cwd(),
    'svn': '',
    'devPubilcPath': 'http://test.sina.com.cn/',
    'onLinePublicPath': 'http://test.sina.com.cn/'
}).argv;

//TODO 支持选择配置文件的方式
//TODO 修改readme以及打tag

const projectName = _.last(argv.dir.split(path.sep));

//为了防止 用户的system time 错误，因此采用用户自己输入时间
let svnYear;

if (argv.svn) {
    let tmpSvnHref = argv.svn.split(path.sep).join('/');
    //主要是处理 有些内容 返回的结构是 https:\xxx\asdfas\asdfa\ 这种
    argv.svn = tmpSvnHref.replace(/^(https:\/)([^\/])(.*)/, '$1/$2$3');
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
    tagPath: argv.svn.replace('trunk', 'tags') + '/' + projectName + '/',
    //标签名字
    tagName: projectName,
    //标签内新增目录
    addPath: 'news/items/' + svnYear + '/' + projectName + '/'
} : null;

let rootDir = dirHandler.getRootDir(argv.dir);

console.log(chalk.green('build project start >>>>>>>>>'));
if (argv.svn) {
    //svn方式初始化
    Promise.all([
        svnHandler.buildSvnProject(rootDir, svnConfig),
        svnHandler.buildSvnProjectQb(svnConfig)
    ]).then(function() {
        console.log(chalk.green('svn trunk and tag qb init done <<<<<<<'));
        console.log(chalk.green('svn addr: %s'), svnConfig.svn);
        return dirHandler.buildProjectDir(rootDir);
    }).then(function() {
        console.log(chalk.green('build project sub dir done <<<<<<<<<'));
        return fileHandler.copyFile({
            devPubilcPath: argv.devPubilcPath,
            onLinePubilcPath: argv.onLinePublicPath
        }, svnConfig, rootDir);
    }).then(function() {
        console.log(chalk.green('copy file done<<<<<<<<<<'));
        console.log(chalk.green('project created, dir is: %s <<<<<<<<<'), rootDir);
    }).catch(function(e) {
        console.log(e.stack);
    });

} else {
    //仅仅初始化本地文件夹
    dirHandler.initRoot(rootDir).then(function() {
        console.log(chalk.green('build root dir done <<<<<<<<<'));
        return dirHandler.buildProjectDir(rootDir);
    }).then(function() {
        console.log(chalk.green('build project sub dir done <<<<<<<<<'));
        return fileHandler.copyFile({
            devPubilcPath: argv.devPubilcPath,
            onLinePubilcPath: argv.onLinePublicPath
        }, svnConfig, rootDir);
    }).then(function() {
        console.log(chalk.green('copy file done<<<<<<<<<<'));
        console.log(chalk.green('project created, dir is: %s <<<<<<<<<'), rootDir);
    }).catch(function(e) {
        console.log(e.stack);
    });
}
