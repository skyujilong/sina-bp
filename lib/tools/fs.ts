import {
    createReadStream
} from 'fs';

import {
    createInterface
} from 'readline';

import BpConf from '../module/bp-conf';

interface Conf{
    workspace: string
    devHost: string
    prodHost: string
    prodImgHost: string
    tinyPngKeys: string[]
}

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


export {
    readLine
}