'use strict';
/**
 * 根据指定的中文长度进行裁切文字
 * @param {*} txt 原文案
 * @param {*} len 最长显示个数
 * @param {*} suffix 最后显示的后缀名
 */
module.exports = function (txt, len, suffix) {
    var showLen = len * 2;
    var result = [];
    //正则表达式中文以及中文标点符号
    var zhReg = /[\u4e00-\u9fa5]|[^\x00-\xff]/;
    var list = txt.split('');
    var tmp = 0;
    for (var i = 0, item; item = list[i]; i++) {
        if (zhReg.test(item)) {
            tmp += 2;
        } else {
            tmp += 1;
        }
        if(tmp >= showLen){
            break;
        }
        result.push(item);
    }
    return result.join('') + (tmp >= showLen ? (suffix || '') : '');
}