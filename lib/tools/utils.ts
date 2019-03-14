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

export {
    isIllegalUrl
}