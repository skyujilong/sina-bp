import {
    createReadStream, lstat, Stats, mkdir, readdir, createWriteStream
} from 'fs';

import { sep, join, resolve } from 'path';

import {
    createInterface
} from 'readline';

import { platform } from 'os';

import BpConf from '../module/bp-conf';

import { transAsyncPromise } from './utils';

interface Conf{
    workspace: string
    devHost: string
    prodHost: string
    prodImgHost: string
    tinyPngKeys: string[]
}

type StringList = string[];

let asyncReadDir = transAsyncPromise(readdir);
let asyncLstat = transAsyncPromise(lstat);
let asyncMkDir = transAsyncPromise(mkdir);

async function readLine(dir: string): Promise<BpConf>{

    return new Promise((resolve,reject)=>{
        let readStream = createReadStream(dir)
        let readline = createInterface({
            input: readStream
        });
        readStream.on('error',(err)=>{
            reject(new Error('配置文件路径错误！'));
        });
        let conf: Conf = {
            workspace:'',
            devHost:'',
            prodHost:'',
            prodImgHost:'',
            tinyPngKeys:[]
        };
        readline.on('line',(text:string):void=>{
            if(text.indexOf('#')==0){
                return;
            }
            let [key,val] = text.split('=');
            if (key == 'tinyPngKeys' && val.indexOf(',') != -1){
                for(let item of val.split(',')){
                    conf.tinyPngKeys.push(item);
                }
            }else{
                conf[key] = val;
            }
        });
        readline.on('close',()=>{
            let {
                workspace,
                devHost,
                prodHost,
                prodImgHost,
                tinyPngKeys
            } = conf;
            if (!workspace || !devHost || !prodHost){
                reject(new Error('配置文件至少需要如下参数：workspace,devHost,prodHost'));
            }

            let bpConf: BpConf = new BpConf(workspace,devHost,prodHost,prodImgHost,tinyPngKeys);
            resolve(bpConf);
        });
    });
}

async function vailDir(location:string){
    let isThrowError = false;
    try{
        let stats = await asyncLstat(location);
        if(stats.isDirectory()){
            isThrowError = true;
        }
    }catch(e){
        
    }
    if (isThrowError){
        throw new Error(`${location}该路径已经存在了！请更换地址。`);
    }
}

/**
 * 建立文件夹
 * @param location 
 */
// async function asyncMkDir(location:string):Promise<void>{
//     return new Promise((resolve,reject)=>{
//         mkdir(location,(err)=>{
//             if(err){
//                 reject(err);
//             }else{
//                 resolve();
//             }
//         })
//     });
// }

/**
 * 处理根目录
 * @param location 
 */
async function mkRootDir(location:string):Promise<void>{
    let list:string[] = location.split(sep);
    let currentDir:string;
    for(let i = 0; i<list.length; i++){
        if(i === 0){
            currentDir = list[i];
            if (platform() !== 'win32') {
                currentDir = '/' + currentDir;
            }
            continue;
        }
        currentDir = join(currentDir,list[i]);
        try {
            // await asyncMkDir(currentDir);
            await transAsyncPromise(mkdir)(currentDir);
        } catch (error) {
            continue;
        }
    }
}

async function copy(copyFrom: string, copyTarget:string):Promise<void>{
    return new Promise((resolve,reject)=>{
        let readStream = createReadStream(copyFrom);
        let writeStream = createWriteStream(copyTarget)
        writeStream.on('finish',()=>{
            resolve();
        });
        readStream.on('error',(err)=>{
            reject(err);
        });
        writeStream.on('error',(err)=>{
            reject(err);
        })
        readStream.pipe(writeStream);
    });
}

async function asyncCopyFile(targetDir:string,relativePath:string):Promise<void>{
    
    let confDir = resolve(__dirname, '..', '..', 'config');
    let dirStats: StringList = await asyncReadDir(join(confDir,relativePath));
    console.log(join(confDir, relativePath));
    for(let name of dirStats){
        let stats:Stats = await asyncLstat(join(confDir,name));
        if (stats.isDirectory()){
            await asyncMkDir(join(targetDir,name));
            await asyncCopyFile(join(targetDir, name), join(relativePath, name));
        }else if(stats.isFile()){
            // await 
            await copy(join(confDir,name),join(targetDir,name));
        }
    }
}


export {
    readLine,
    asyncLstat,
    mkRootDir,
    vailDir,
    asyncCopyFile
}