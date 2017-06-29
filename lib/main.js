'use strict';

const path = require('path');
const svnHandler = require('./svnInit');
const _ = require('lodash');
const dirHandler = require('./initDir');
const fileHandler = require('./copyFile.js');
const chalk = require('chalk');
const initOptions = require('./initOptions.js');
const co = require('co');
const transformDir = require('./util').transformDir;

//初始化配置文件信息，之后执行build程序
console.log(chalk.green('构建项目开始 >>>>>>>>>'));
console.log(chalk.green('解析参数开始 >>>>>>>>>'));
let rootDir;
initOptions().then((options) => {
    console.log(chalk.green('解析参数结束 >>>>>>>>>'));
    // console.log(require('util').inspect(options, { depth: null }));
    rootDir = transformDir(options.workspace) + path.sep + options.name;
    //TODO 检查 rootDir是否已经存在了
    // 执行方法
    return co(function * () {
        //校验根目录
        yield dirHandler.validateRoot(rootDir);

        if (options.qbNewDir !== '' && options.svn !== '') {
            console.log(chalk.green('初始化svn与svn qb开始 >>>>>>>>>'));
            // init svn whith qb
            yield Promise.all([
                svnHandler.buildSvnProject(rootDir, {
                    name: options.name,
                    svn: options.qbInfo.svnUrl
                }),
                svnHandler.buildSvnProjectQb({svnTagUrl: options.qbInfo.svnTagUrl})
            ]);
            console.log(chalk.green('初始化svn与svn qb >>>>>>>>>'));

        } else if (options.svn !== '') {
            console.log(chalk.green('初始化svn开始 >>>>>>>>>'));
            // init svn with out qb
            yield svnHandler.buildSvnProject(rootDir, {
                name: options.name,
                svn: options.qbInfo.svnUrl
            });
            console.log(chalk.green('初始化svn结束 >>>>>>>>>'));
        } else {
            console.log(chalk.green('初始化项目根目录开始 >>>>>>>>>'));
            // init project
            yield dirHandler.initRoot(rootDir);
            console.log(chalk.green('初始化项目根目录结束 >>>>>>>>>'));
        }

        console.log(chalk.green('初始化项目目录与文件开始 >>>>>>>>>'));
        yield dirHandler.buildProjectDir(rootDir);
        //修改 copy配置文件代码
        yield fileHandler.copyFile(options, rootDir);
        console.log(chalk.green('初始化项目目录与文件结束 >>>>>>>>>'));
    });
}).then(() => {
    console.log(chalk.green('构建项目结束 >>>>>>>>>'));
    console.log(chalk.yellow('构建项目地址：%s'),rootDir);
    console.log(chalk.green('感谢使用！power by jilong5 >>>>>>>>>'));
}).catch((e) => {
    console.log(chalk.bold.red('Oops!程序发生异常！'));
    console.log(chalk.red(e.message));
    console.log(chalk.bold.red('详细信息：'));
    console.log(chalk.red(e.stack));
});
