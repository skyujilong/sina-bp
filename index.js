/**
 * Created by sina on 2016/6/27.
 */
"use strict";
const path = require('path');
const svnHandler = require('./lib/svnInit');
const _ = require('lodash');
const dirHandler = require('./lib/initDir');
const fileHandler = require('./lib/copyFile.js');
const chalk = require('chalk');
const initOptions = require('./lib/initOptions.js');
const co = require('co');
const transformDir = require('./lib/util').transformDir;
//初始化配置文件信息，之后执行build程序
initOptions().then((options) => {
    // let rootDir = path.resolve(options.workspace, options.name);
    let rootDir = transformDir(options.workspace + '/' + options.name);
    console.log(rootDir);
    console.log(options);
    // 执行方法
    return co(function * () {
        if (options.qbNewDir !== '' && options.svn !== '') {
            // init svn whith qb
            yield Promise.all([
                svnHandler.buildSvnProject(rootDir, {
                    name: options.name,
                    svn: options.qbInfo.svnUrl
                }),
                svnHandler.buildSvnProjectQb({svnTagUrl: options.qbInfo.svnTagUrl})
            ]);

        } else if (options.svn !== '') {
            // init svn with out qb
            yield svnHandler.buildSvnProject(rootDir, {
                name: options.name,
                svn: options.qbInfo.svnUrl
            })
        } else {
            // init project
            yield dirHandler.initRoot(rootDir);
        }

        yield dirHandler.buildProjectDir(rootDir);
        //修改 copy配置文件代码
        yield fileHandler.copyFile(options, rootDir);

    });
}).then(() => {
    //DONE..........
}).catch((e) => {
    console.log(e.stack);
});

return;

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

let svnConfig = argv.svn
    ? {
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
    }
    : null;

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

function * initProjectWithoutSVN(rootDir) {
    yield dirHandler.initRoot(rootDir);
    console.log(chalk.green('build root dir done <<<<<<<<<'));
    yield dirHandler.buildProjectDir(rootDir);
    console.log(chalk.green('build project sub dir done <<<<<<<<<'));
    yield fileHandler.copyFile({
        devPubilcPath: argv.devPubilcPath,
        onLinePubilcPath: argv.onLinePublicPath
    }, svnConfig, rootDir);
    console.log(chalk.green('copy file done<<<<<<<<<<'));
    console.log(chalk.green('project created, dir is: %s <<<<<<<<<'), rootDir);
}
