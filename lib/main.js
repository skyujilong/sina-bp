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
const Constant = require('./constant');

let argv = require('yargs').help().alias('help', 'h').version().alias('version', 'v').usage([
    '项目地址与说明：https://github.com/skyujilong/sina-bp',
    '版本：' + require('../package.json').version,
    '用法:',
    '1、配置文件方案: $0 -c [你配置文件的地址] -n [你要生成的项目名字]',
    '2、非配置文件方案: $0 -d [你要生成项目的地址]'
].join('\n')).options({
    dir: {
        alias: 'd',
        describe: '生成项目的路径',
        type: 'string'
    },
    conf: {
        alias: 'c',
        describe: '配置文件地址',
        type: 'string'
    },
    name: {
        alias: 'n',
        describe: '项目名称',
        type: 'string'
    },
    devHost: {
        describe: '测试环境绑定Host',
        type: 'string',
        default: Constant.defaultHost
    },
    onLineHost: {
        describe: '线上环境地址',
        type: 'string',
        default: Constant.defaultHost
    },
    onLineImgHost: {
        describe: '线上环境图片地址',
        type: 'string',
        default: Constant.defaultHost
    }
}).argv;

if (!(argv.dir || (argv.conf && argv.name))) {
    console.log('请提供dir参数，或者conf参数与name参数！用例 sina-bp -h');
    return;
}
//初始化配置文件信息，之后执行build程序
console.log(chalk.green('构建项目开始 >>>>>>>>>'));
console.log(chalk.green('解析参数开始 >>>>>>>>>'));
let rootDir;
initOptions(argv).then((options) => {
    console.log(chalk.green('解析参数结束 >>>>>>>>>'));
    // console.log(require('util').inspect(options, { depth: null }));
    rootDir = transformDir(options.workspace) + path.sep + options.name;
    // 检查 rootDir是否已经存在了
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
    console.log(chalk.yellow('构建项目地址：%s'), rootDir);
    console.log(chalk.green('感谢使用！power by jilong5 >>>>>>>>>'));
}).catch((e) => {
    console.log(chalk.bold.red('Oops!程序发生异常！'));
    console.log(chalk.red(e.message));
    console.log(chalk.bold.red('详细信息：'));
    console.log(chalk.red(e.stack));
});
