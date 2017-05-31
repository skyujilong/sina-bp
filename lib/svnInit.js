'use strict';
const svnUltimate = require('node-svn-ultimate');
const co = require('co');
const thunkify = require('thunkify');


/**
 * 建立svn trunk路径与 checkout 路径
 * @param  {[type]} pathDir   [description]
 * @param  {[type]} svnConfig [description]
 * @return {[type]}           [description]
 */
exports.buildSvnProject = function(pathDir, svnConfig) {
    return co(function*() {
        //make svn dir
        yield thunkify(svnUltimate.commands.mkdir)(
            svnConfig.svn, {
                params: [
                    '-m "init ' + svnConfig.tagName + ' "',
                    '--parents'
                ]
            });
        //checkout svn dir
        yield thunkify(svnUltimate.commands.checkout)(
            svnConfig.svn,
            pathDir
        );
    });
};
/**
 * 建立qb系统
 * @param  {[type]} svnConfig [description]
 * @return {[type]}           [description]
 */
exports.buildSvnProjectQb = function(svnConfig) {
    return co(function*() {
        //创建tag
        yield thunkify(svnUltimate.commands.mkdir)(svnConfig.tagPath, {
            params: ['-m "init tag ' + svnConfig.tagName + ' "','--parents']
        });
        yield thunkify(svnUltimate.commands.mkdir)(svnConfig.tagPath + '/qb/', {
            params: ['-m "init qb"','--parents']
        });
    });
};
