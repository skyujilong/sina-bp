'use strict';
const svnUltimate = require('node-svn-ultimate');
const path = require('path');
const co = require('co');
const thunkify = require('thunkify');
/**
 * 初始化TAG与QB文件夹
 * @param  {[type]} svnConfig [description]
 * @return {[type]}           [description]
 */
function buildQB(svnConfig) {
    svnUltimate.commands.mkdir(svnConfig.tagPath, {
        params: ['-m "init tag ' + svnConfig.tagName + ' "']
    }, function(err) {
        if (err) {
            throw err;
        }
        svnUltimate.commands.mkdir(svnConfig.tagPath + '/qb/', {
            params: ['-m "init qb"']
        }, function(err) {
            if (err) {
                throw err;
            }
        });
    });
}


//TODO svn流程添加
exports.buildSvnProject = function(pathDir, svnConfig) {
    return co(function*() {
        //make svn dir
        yield thunkify(svnUltimate.commands.mkdir)(
            svnConfig.svn, {
                params: [
                    '-m "init ' + svnConfig.tagName + ' "'
                ]
            });
        //checkout svn dir
        yield thunkify(svnUltimate.commands.checkout)(
            svnConfig.svn,
            pathDir
        );
    });
};

exports.buildSvnProjectQb = function(svnConfig) {
    return co(function*() {
        //创建tag
        yield thunkify(svnUltimate.commands.mkdir)(svnConfig.tagPath, {
            params: ['-m "init tag ' + svnConfig.tagName + ' "']
        });
        yield thunkify(svnUltimate.commands.mkdir)(svnConfig.tagPath + '/qb/', {
            params: ['-m "init qb"']
        });
    });
};

// module.exports = {
//
//     init: function(pathDir, svnConfig, fn) {
//
//         let cwd = process.cwd(),
//             absPath;
//         if (path.isAbsolute(pathDir)) {
//             absPath = pathDir;
//         } else {
//             absPath = path.resolve(cwd, pathDir);
//         }
//
//         //创建svn 根目录
//         svnUltimate.commands.mkdir(svnConfig.svn, {
//             params: [
//                 '-m "init ' + svnConfig.tagName + ' "'
//             ]
//         }, function(err) {
//             if (err) {
//                 throw err;
//             }
//             //checkout项目，然后在项目中构建目录
//             svnUltimate.commands.checkout(svnConfig.svn, absPath, function(err) {
//                 if (err) {
//                     throw err;
//                 }
//                 buildQB(svnConfig);
//                 //创建文件夹
//                 fn(absPath);
//             });
//
//         });
//     }
// }
