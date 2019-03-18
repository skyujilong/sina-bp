// 主线逻辑

import {
    help
} from 'yargs';
import * as packageJson from './../package.json';
import cmd from './tools/cmd';
import answerLine, {
    answerLineOk
} from './tools/answer-line';
import {
    transformDir,
    isIllegalGit,
    isIllegalUrl,
    getGitName
} from './tools/utils';
import BpConf from './module/bp-conf';
import BuildInfo from './module/buid-info';
import {readLine} from './tools/fs';

let {argv} = help().alias('help', 'h').version().alias('version', 'v').usage([
    '项目地址与说明：https://github.com/skyujilong/sina-bp',
    '版本：' + packageJson.version,
    '用法:',
    '1、配置文件方案: sina-bp -c [你配置文件的地址]',
    '2、非配置文件方案: sina-bp -d [你要生成项目的地址] -n [你要生成的项目名字]'
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
        default: 'http://test.sina.com.cn/'
    }
});


async function getConf(): Promise<BuildInfo>{
    //TODO:解析argv参数
    let isCompany: boolean = await answerLineOk('是否是公司项目(y/n):', ['y', 'n']) === 'y';

    let bpConf:BpConf;

    // 参数中带有配置文件地址
    if(argv.conf){
        // 是公司项目。 判断配置文件是否添加到参数上了。
        let confDir = transformDir(argv.conf);
        try{
            bpConf = await readLine(confDir);
        }catch(e){
            let confDir = await answerLine('配置文件路径输入错误，请输入正确的绝对路径：');
            try{
                bpConf = await readLine(confDir);
            }catch(e){
                throw e;
            }
        }
    }

    let git:string = '';
    let isIllegalGitFlag = false;
    while (true) {
        if (isCompany && isIllegalGit(git)) {
            git = await answerLine(isIllegalGitFlag ? '请输入合法的git地址（仅支持ssh）:' :'请输入git地址（仅支持ssh）:');
            isIllegalGitFlag = true;
        } else if (!isCompany && (git !== 'n' && isIllegalGit(git))) {
            git = await answerLine(isIllegalGitFlag ? '请输入合法的git地址(仅支持ssh & 输入n为不添加git地址):' :'请输入git地址(仅支持ssh & 输入n为不添加git地址):');
            isIllegalGitFlag = true;
        } else if (git === 'n' && !isCompany) {
            git = '';
            break;
        } else if (!isIllegalGit(git)){
            break;
        }
    }
    if (isCompany) {
        if (!bpConf) {
            let confDir = await answerLine('请输入配置文件地址:');
            try {
                bpConf = await readLine(confDir);
            } catch (e) {
                throw e;
            }
        }
        return new BuildInfo(getGitName(git), git, true, bpConf);
    } else {
        let testConf = await getTestConf(git,bpConf);
        return testConf;
    }
}

/**
 * 获取本地的练习 构建对象实例子
 * @param git 
 * @param bpConf 
 */
async function getTestConf(git: string, bpConf: BpConf): Promise<BuildInfo>{
    let name: string;
    if (argv.name) {
        name = argv.name;
    } else if (git) {
        name = getGitName(git);
    } else {
        name = await answerLine('请输入项目名称(英文包含字母以及-_):');
    }

    if (bpConf) {
        return new BuildInfo(name, git, false, bpConf);
    } else {
        let workspace:string;
        if(!argv.dir){
            workspace = await answerLine('请输入项目生成地址：');
        }else{
            workspace = argv.dir;
        }
        let prodHost: string = argv.devHost;
        let prodImgHost: string = argv.devHost;
        let devHost: string = argv.devHost;
        return new BuildInfo(name, git, false, new BpConf(workspace, devHost, prodHost, prodImgHost, ['346gfotHJspgPYXmOuSAWhSl4CxlUox7']));
    }
}


async function build(argvs:string):Promise<string>{
    let buildInfo: BuildInfo = await getConf();
    console.log(buildInfo);
    if(buildInfo.git){
        //走git下载流程, 以下git clone因为 参数--progress的原因，在这种spawn中，会在错误stderr流中输出内容。
        await cmd('git', ['clone', buildInfo.git, '--progress'], {
            cwd: buildInfo.bpConf.workspace
        }).catch((e)=>{
            console.log(e.stack);
        });
    }
    //TODO: 向git || workspace + name 中 建立文件夹。

    //TODO: 向git || workspace + name 中 copy文件。

    return '项目地址：/data1/wwww';
}


build(JSON.stringify(argv)).then((dir)=>{
    console.log(dir);
    console.log('done!!!');
});