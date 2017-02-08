"use strict";
const fs = require('fs');
const path = require('path');
const currentLocation = process.cwd();

function makeDir(url, cb) {
    var arr = url.split(path.sep);
    var relativePos = '';

    //路径必须为相对路径，储存相对路径的位置
    
    // if(arr.shift() === '.')
    
    if(arr[0] === '.'||arr[0] === '..'){
        relativePos = arr.shift();
    }else{
        relativePos = '.';        
    }
    



    cycleMakeDir(url, arr, 0);

    function cycleMakeDir(url, arr, pos) {
        // 从数组的第一位开始创建
        fs.mkdir(relativePos + '/' + arr[pos], function(err) {
            if (!err) {
                // 如果成功了创先数组的下一位路径，如果超过数组的最大路径结束运行
                if (pos >= (arr.length - 1)) {
                    if (cb) {
                        cb();
                    }
                    return;
                }

                relativePos = relativePos + '/' + arr[pos];
                cycleMakeDir(url, arr, pos + 1)
                    //如果返回为空代表创建成功
                

            } else {

                if (pos >= (arr.length - 1)) {
                    if (cb) {
                        cb();
                    }
                    return;
                }

                if (err.errno === -4075) {
                    relativePos = relativePos + '/' + arr[pos];
                    cycleMakeDir(url, arr, pos + 1)
                        //如果返回为空代表创建成功
                    
                } else {
                    return
                }



            }
        });
    }
}

module.exports = makeDir;