import * as os from 'os';
import * as _ from 'lodash';
import * as path from 'path';
/**
 * 判断是否是非法的url
 * @param url 
 */
function isIllegalUrl(url:string):boolean{
    let reg = /^https{0,1}:\/\//;
    if (reg.test(url)){
        return false;
    }else{
        return true;
    }
}

function isIllegalGit(url:string):boolean{
    let reg = /^(ssh:\/\/){0,1}git@[\/\w\.\-:\d]*git$/;
    return !reg.test(url);
}

/**
 * 转换在win控制台下 输入/d/workspace这种linux路径 转化为对应平台的路径
 * @param dir 
 */
function transformDir(dir:string):string{
    if(os.platform() !== 'win32'){
        return dir;
    }
    let returnDir:string = '';
    if(/^\//.test(dir)){
        let dirList:string[] = dir.split('/');
        _.each(dirList,(item,index)=>{
            if(index === 0){
                return ;
            }
            if (index === 1){
                returnDir += (item + ':');
            }else {
                returnDir += ('\\' + item);
            }
        });
        return returnDir;
    }else{
        return dir;
    }

}
/**
 * 让url指定结尾，如果有结尾的话就替换结尾
 * @param  {[type]} url    [description]
 * @param  {[type]} endStr [description]
 * @return {[type]}        [description]
 */
function urlEndSuff(url:string,endStr:string):string{
    let reg:RegExp = new RegExp(endStr + '$');
    if (reg.test(url)) {
        return url;
    } else {
        return url + endStr;
    }
}

/**
 * 转化 非正常的url
 * @param  {[type]} url 带转换url
 * @return {[type]}     返回转化后的url
 */
function transHostUrl(url:string):string{
    if (!/^https{0,1}/.test(url)) {
        throw new Error('url must start with http or https');
    }
    let tmpSvnHref = url.split(path.sep).join('/');
    return tmpSvnHref.replace(/^(https{0,1}:\/)([^\/])(.*)/, '$1/$2$3')
}

/**
 * 获取git地址的项目名字
 * @param url 
 */
function getGitName(url:string):string{
    return /\/([\w-]*)\.git$/.exec(url)[1];
}

/**
 * 转化普通方法为async的方法。
 * @param fun 
 */
function transAsyncPromise(fun:Function):Function{
    return async function<T>(...args):Promise<T>{
        return new Promise((resolve,reject)=>{
            fun.call(null,...args,(err:Error,arg1:T)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(arg1);
                }
            });
        });
    }
}


export {
    isIllegalUrl,
    isIllegalGit,
    transformDir,
    urlEndSuff,
    transHostUrl,
    getGitName,
    transAsyncPromise
}