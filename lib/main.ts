// 主线逻辑

import {
    help
} from 'yargs';
import * as packageJson from './../package.json';
import cmd from './tools/cmd';
import { answerLineOk} from './tools/answer-line';

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

// console.log(JSON.stringify(argv));
// console.log(<ProjectArgv>argv);
// console.log(<string>argv.name);

// console.log(packageJson.version);
//TODO:计算线上的上线地址！!


async function main(argvs:string):Promise<void>{
    // await cmd('ls', ['-al', './']);
    let isCompany: string = await answerLineOk('是否是公司项目(y/n):',['y','n']);
    console.log(isCompany);
    console.log(argvs);
}


main(JSON.stringify(argv)).then(()=>{
    console.log('done!!!');
})