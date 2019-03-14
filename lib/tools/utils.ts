import os from 'os';
import _ from 'lodash';
import path from 'path';
/**
 * 判断是否是非法的url
 * @param url 
 */
function isIllegalUrl(url:string):boolean{
    let reg = /^http(s):\/\//;
    if (reg.test(url)){
        return true;
    }else{
        return false;
    }
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

export {
    isIllegalUrl,
    transformDir,
    urlEndSuff,
    transHostUrl
}