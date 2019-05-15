"use strict";
// 主线逻辑
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = require("yargs");
const packageJson = require("./../package.json");
const cmd_1 = require("./tools/cmd");
const answer_line_1 = require("./tools/answer-line");
const utils_1 = require("./tools/utils");
const bp_conf_1 = require("./module/bp-conf");
const buid_info_1 = require("./module/buid-info");
const fs_1 = require("./tools/fs");
const path_1 = require("path");
let { argv } = yargs_1.help().alias('help', 'h').version().alias('version', 'v').usage([
    '项目地址与说明：https://github.com/skyujilong/sina-bp',
    '版本：' + packageJson.version,
    '用法:',
    '1、配置文件方案: sina-bp -c [你配置文件的地址]',
    '2、非配置文件方案1: sina-bp -d [你要生成项目的地址]',
    '3、非配置文件方案2: sina-bp'
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
        default: 'test.sina.com.cn'
    }
});
function getConf() {
    return __awaiter(this, void 0, void 0, function* () {
        //解析argv参数
        let isCompany = (yield answer_line_1.answerLineOk('是否是公司项目(y/n):', ['y', 'n'])) === 'y';
        let isActivity = false;
        if (isCompany) {
            isActivity = (yield answer_line_1.answerLineOk('是否是公司的活动项目(y/n)', ['y', 'n'])) === 'y';
        }
        let name;
        if (isActivity) {
            if (argv.name) {
                name = argv.name;
            }
            else {
                name = yield answer_line_1.default('请输入项目名称(英文包含字母以及-_):');
            }
        }
        let bpConf;
        // 参数中带有配置文件地址
        if (argv.conf) {
            // 是公司项目。 判断配置文件是否添加到参数上了。
            let confDir = utils_1.transformDir(argv.conf);
            try {
                bpConf = yield fs_1.readLine(confDir);
            }
            catch (e) {
                let confDir = yield answer_line_1.default('配置文件路径输入错误，请输入正确的绝对路径：');
                try {
                    bpConf = yield fs_1.readLine(confDir);
                }
                catch (e) {
                    throw e;
                }
            }
        }
        let git = '';
        let isIllegalGitFlag = false;
        while (true) {
            if (isCompany && utils_1.isIllegalGit(git)) {
                git = yield answer_line_1.default(isIllegalGitFlag ? '请输入合法的git地址（仅支持ssh）:' : '请输入git地址（仅支持ssh）:');
                isIllegalGitFlag = true;
            }
            else if (!isCompany && (git !== 'n' && utils_1.isIllegalGit(git))) {
                git = yield answer_line_1.default(isIllegalGitFlag ? '请输入合法的git地址(仅支持ssh & 输入n为不添加git地址):' : '请输入git地址(仅支持ssh & 输入n为不添加git地址):');
                isIllegalGitFlag = true;
            }
            else if (git === 'n' && !isCompany) {
                git = '';
                break;
            }
            else if (!utils_1.isIllegalGit(git)) {
                break;
            }
        }
        if (isCompany) {
            if (!bpConf) {
                let confDir = yield answer_line_1.default('请输入配置文件地址:(仅支持绝对路径)');
                try {
                    bpConf = yield fs_1.readLine(confDir);
                }
                catch (e) {
                    throw e;
                }
            }
            let buildInfo = new buid_info_1.default(isActivity ? name : utils_1.getGitName(git), git, isCompany, isActivity, bpConf);
            if (path_1.isAbsolute(bpConf.qbDir)) {
                //删除/ 默认应该不是绝对路径的。
                bpConf.qbDir = bpConf.qbDir.substring(1);
            }
            // 更新qbDir的路径
            bpConf.qbDir = utils_1.urlEndSuff(bpConf.qbDir, '/') + new Date().getFullYear() + '/' + buildInfo.name + '/';
            return buildInfo;
        }
        else {
            let testConf = yield getTestConf(git, bpConf);
            return testConf;
        }
    });
}
/**
 * 获取本地的练习 构建对象实例子
 * @param git
 * @param bpConf
 */
function getTestConf(git, bpConf) {
    return __awaiter(this, void 0, void 0, function* () {
        let name;
        if (argv.name) {
            name = argv.name;
        }
        else if (git) {
            name = utils_1.getGitName(git);
        }
        else {
            name = yield answer_line_1.default('请输入项目名称(英文包含字母以及-_):');
        }
        if (bpConf) {
            return new buid_info_1.default(name, git, false, false, bpConf);
        }
        else {
            let workspace;
            if (!argv.dir) {
                workspace = yield answer_line_1.default('请输入项目生成地址：');
            }
            else {
                // 防止win下的 路径输入错误。
                workspace = utils_1.transformDir(argv.dir);
            }
            let prodHost = argv.devHost;
            let prodImgHost = argv.devHost;
            let devHost = argv.devHost;
            return new buid_info_1.default(name, git, false, false, new bp_conf_1.default(workspace, devHost, prodHost, prodImgHost, ['346gfotHJspgPYXmOuSAWhSl4CxlUox7']));
        }
    });
}
function build() {
    return __awaiter(this, void 0, void 0, function* () {
        //TODO: projectDir 问题，不能重新建立了， 如果是 activity的项目，需要在原来的基础上去添加内容。
        let buildInfo = yield getConf();
        let projectDir;
        if (!buildInfo.isActivity) {
            projectDir = path_1.join(buildInfo.bpConf.workspace, buildInfo.name);
            yield fs_1.vailDir(projectDir);
        }
        else {
            projectDir = path_1.join(buildInfo.bpConf.workspace, utils_1.getGitName(buildInfo.git));
        }
        if (buildInfo.git && !buildInfo.isActivity) {
            yield cmd_1.default('git', ['clone', buildInfo.git, '--progress'], {
                cwd: buildInfo.bpConf.workspace
            });
        }
        else if (buildInfo.isActivity) {
            try {
                yield fs_1.vailDir(projectDir);
            }
            catch (e) {
                //代表没有下载 git内容。
                yield cmd_1.default('git', ['clone', buildInfo.git, '--progress'], {
                    cwd: buildInfo.bpConf.workspace
                });
            }
        }
        else {
            //建立根目录
            yield fs_1.mkRootDir(projectDir);
        }
        //这里根据是否是 活动项目（isActivity）修改一下projectDir路径,并且建立根目录
        if (buildInfo.isActivity) {
            projectDir = path_1.join(projectDir, buildInfo.name);
            yield fs_1.mkRootDir(projectDir);
        }
        //递归 config文件夹
        yield fs_1.asyncCopyFile(projectDir, '/', buildInfo);
        //npm过去之后，不能够按照预期生成.gitignore文件
        yield fs_1.asyncWriteFile(projectDir, '.gitignore', ['node_modules/', 'jspm_packages/', '.DS_Store', '*.log', '.npm', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*'].join('\n'));
        //安装项目
        let isUseYarn = (yield answer_line_1.answerLineOk('是否使用yarn安装模块？（y采用yarn安装,n采用npm安装）', ['y', 'n'])) === 'y';
        if (isUseYarn) {
            yield cmd_1.default('yarn', ['install'], {
                cwd: projectDir
            });
        }
        else {
            yield cmd_1.default('npm', ['install'], {
                cwd: projectDir
            });
        }
        console.log('项目安装完毕！');
        //提交git内容，并且创建一个开发分支
        if (buildInfo.git) {
            if (buildInfo.isActivity) {
                yield cmd_1.default('git', ['checkout', 'master'], {
                    cwd: projectDir
                });
            }
            yield cmd_1.default('git', ['add', '*'], {
                cwd: projectDir
            });
            yield cmd_1.default('git', ['commit', '-m', '初始化基础文件！'], {
                cwd: projectDir
            });
            yield cmd_1.default('git', ['push', 'origin', 'master'], {
                cwd: projectDir
            });
            yield cmd_1.default('git', ['checkout', '-b', 'dev'], {
                cwd: projectDir
            });
            console.log('开发分支创建完毕！');
        }
        return `项目地址：${projectDir}`;
    });
}
build().then((dir) => {
    console.log(dir);
}).catch(e => console.log(e));
