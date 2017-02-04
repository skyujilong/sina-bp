/**
 * Created by sina on 2016/5/20.
 */
'use strict';
var art = require('tmodjs-loader/runtime');
/**
 * 对日期进行格式化，
 * @param date 要格式化的日期
 * @param format 进行格式化的模式字符串
 *     支持的模式字母有：
 *     y:年,
 *     M:年中的月份(1-12),
 *     d:月份中的天(1-31),
 *     h:小时(0-23),
 *     m:分(0-59),
 *     s:秒(0-59),
 *     S:毫秒(0-999),
 *     q:季度(1-4)
 * @return String
 * @author yanis.wang
 * @see	http://yaniswang.com/frontend/2013/02/16/dateformat-performance/
 */
art.helper('dateFormat', function (date, format) {

    date = new Date(date);

    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
            if(all.length > 1){
                v = '0' + v;
                v = v.substr(v.length-2);
            }
            return v;
        }
        else if(t === 'y'){
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
});


/**
 * title文案长度格式化方法
 * @param  {[string]} titleFormat [title文案内容]
 * @param  {[number]} function    [文案截取的长度]
 * @return {[string]}             [截取长度后的文案]
 */
art.helper('titleFormat', function(text, num) {
    var result = '',len2x = num * 2;
    text += '';
    num = num - 0;
    if (Object.prototype.toString.call(len2x) === '[object Number]' && !isNaN(len2x) && text.replace(/[^\x00-\xff]/g,"01").length > len2x) {
        Array.prototype.forEach.call(text.split(''),function(item){
            if(len2x <= 1){
                return;
            }
            if(/[^\x00-\xff]/.test(item)){
                len2x -= 2;
            }else{
                len2x --;
            }
            result += item;
        });
        return result + '...';
    } else {
        return text;
    }
});
/**
 * 等比例压缩图片，接口由徐焱提供，w：要压缩的宽度，url：要被压缩的图片地址
 */
art.helper('resizeImg',function(url, w){
    if(!url){
        return '';
    }
    return "http://s.img.mix.sina.com.cn/auto/resize?img=" + encodeURIComponent(url) + '&size=' + w + '_0';
});
