'use strict';
const svnUltimate = require('node-svn-ultimate');
const co = require('co');
const thunkify = require('thunkify');


/**
 * 建立svn trunk路径与 checkout 路径
 * @param  {[type]} pathDir   [description]
 * @param  {[type]} options [description]
 * @return {[type]}           [description]
 */
exports.buildSvnProject = function(pathDir, options) {
    return co(function*() {
        //make svn dir
        yield thunkify(svnUltimate.commands.mkdir)(
            options.svn, {
                params: [
                    '-m "init ' + options.name + ' "',
                    '--parents'
                ]
            });
        //checkout svn dir
        yield thunkify(svnUltimate.commands.checkout)(
            options.svn,
            pathDir
        );
    });
};
/**
 * 建立qb系统
 * @param  {[type]} options [description]
 * @return {[type]}           [description]
 */
exports.buildSvnProjectQb = function(options) {
    return co(function*() {
        //创建tag
        yield thunkify(svnUltimate.commands.mkdir)(options.svnTagUrl + '/qb/', {
            params: ['-m "init qb"','--parents']
        });
    });
};
