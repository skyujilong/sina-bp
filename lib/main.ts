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
    transformDir
} from './tools/utils';
import BpConf from './module/bp-conf';
import BuildInfo from './module/buid-info';
import {readLine} from './tools/fs';

let {argv} = help().alias('help', 'h').version().alias('version', 'v').usage([
    '项目地址与说明：https://github.com/skyujilong/sina-bp',
    '版本：' + packageJson.version,
    '用法:',
    '1、配置文件方案: sina-bp -c [你配置文件的地址] -n [你要生成的项目名字]',
    '2、非配置文件方案: sina-bp -d [你要生成项目的地址]'
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
    let isCompany: string = await answerLineOk('是否是公司项目(y/n):', ['y', 'n']);
    let bpConf:BpConf;
    if(isCompany === 'y'){
        // 是公司项目。 判断配置文件是否添加到参数上了。
        let confDir = transformDir(argv.conf);
        bpConf = await readLine(confDir);
    }

    return new BuildInfo('', '', new BpConf('','','','',[]));
}


async function build(argvs:string):Promise<string>{
    let buildInfo: BuildInfo = await getConf();
    // await cmd('ls', ['-al', './']);
    // let isCompany: string = await answerLineOk('是否是公司项目(y/n):',['y','n']);
    let git: string = await answerLine('git地址(输入n为不添加git地址):');
    if(git.toLocaleLowerCase() === 'n'){
        git = '';
    }
    return '项目地址：/data1/wwww';
}


build(JSON.stringify(argv)).then((dir)=>{
    console.log(dir);
    console.log('done!!!');
})